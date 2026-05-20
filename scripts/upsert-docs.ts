// Upsert medical documents to Pinecone - Load textbook content into vector database

import { Pinecone } from "@pinecone-database/pinecone";
import { embeddingService } from "../src/services/embedding.service.js";
import { config } from "../src/config/env.js";
import * as fs from "fs/promises";
import * as path from "path";

// Document interface for upserting
interface MedicalDocument {
  id: string;
  content: string;
  metadata: {
    source: string;
    chapter?: string;
    page?: number;
    section?: string;
  };
}

// Chunk text into smaller passages for better retrieval
function chunkText(text: string, maxChunkSize: number = 500): string[] {
  const sentences = text.split(/[.!?]+\s+/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? " " : "") + sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

// Read all PDF files from data folder using pdfjs-dist
async function loadPdfDocuments(dataDir: string): Promise<MedicalDocument[]> {
  const documents: MedicalDocument[] = [];
  
  try {
    // Dynamic import for pdfjs-dist LEGACY build (Node.js compatible)
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
    
    const files = await fs.readdir(dataDir);
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
    
    console.log(`📄 Found ${pdfFiles.length} PDF file(s) in data/ folder\n`);
    
    for (const filename of pdfFiles) {
      const filePath = path.join(dataDir, filename);
      console.log(`📖 Processing: ${filename}...`);
      
      // Read PDF file
      const dataBuffer = await fs.readFile(filePath);
      const data = new Uint8Array(dataBuffer);
      
      // Load PDF document
      const loadingTask = pdfjsLib.getDocument({ data });
      const pdf = await loadingTask.promise;
      
      console.log(`   Pages: ${pdf.numPages}`);
      
      let fullText = "";
      
      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + "\n\n";
      }
      
      console.log(`   Extracted ${fullText.length} characters`);
      
      // Chunk the text
      const chunks = chunkText(fullText, 500);
      console.log(`   Created ${chunks.length} chunks\n`);
      
      // Create documents from chunks
      for (let i = 0; i < chunks.length; i++) {
        documents.push({
          id: `${filename.replace('.pdf', '')}-chunk-${i}`,
          content: chunks[i],
          metadata: {
            source: filename,
            page: Math.floor(i / 2) + 1, // Approximate page number
            section: `Chunk ${i + 1}`
          }
        });
      }
    }
    
    console.log(`\n📚 Total chunks created: ${documents.length}\n`);
    return documents;
    
  } catch (error) {
    console.error("Error reading PDF files:", error);
    throw error;
  }
}

// Main upsert function
async function upsertDocuments() {
  try {
    console.log("🏥 Medical Document Upsert - Starting...\n");

    // Initialize Pinecone
    const pinecone = new Pinecone({ apiKey: config.PINECONE_API_KEY });
    const index = pinecone.Index(config.PINECONE_INDEX_NAME).namespace(config.PINECONE_NAMESPACE);

    // Load documents from PDF files in data folder
    const dataDir = path.join(process.cwd(), 'data');
    const documents = await loadPdfDocuments(dataDir);

    if (documents.length === 0) {
      console.log("⚠️  No documents found. Please add PDF files to the data/ folder.");
      return;
    }

    console.log(`📚 Processing ${documents.length} document chunks...\n`);

    // Process each document
    const vectors = [];
    
    for (let i = 0; i < documents.length; i++) {
      const doc = documents[i];
      
      if (i % 10 === 0) {
        console.log(`Processing [${i + 1}/${documents.length}]...`);
      }

      // Create embedding for the document
      const embedding = await embeddingService.getEmbedding(doc.content);

      // Prepare vector for Pinecone
      vectors.push({
        id: doc.id,
        values: embedding,
        metadata: {
          content: doc.content,
          ...doc.metadata
        }
      });
    }
    
    console.log(`\n✅ All embeddings created (${vectors.length} vectors)\n`);

    // Upsert to Pinecone in batches
    console.log("📤 Uploading to Pinecone...\n");
    const batchSize = 100;
    
    for (let i = 0; i < vectors.length; i += batchSize) {
      const batch = vectors.slice(i, i + batchSize);
      await index.upsert(batch);
      console.log(`  ✅ Uploaded batch ${Math.floor(i / batchSize) + 1} (${batch.length} vectors)`);
    }

    console.log("\n============================================================");
    console.log(`✅ Successfully upserted ${vectors.length} documents to Pinecone!`);
    console.log("============================================================\n");

  } catch (error) {
    console.error("❌ Upsert failed:", error);
    throw error;
  }
}

// Run the upsert
upsertDocuments();
