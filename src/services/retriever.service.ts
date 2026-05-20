// Retriever service - Combines embeddings + Pinecone search for medical document retrieval

import { embeddingService } from "./embedding.service.js";
import { queryPinecone } from "../clients/pinecone.client.js";
import { RAGQuery, RAGResponse } from "../types/rag.types.js";

export class RetrieverService {
  // Retrieve relevant medical documents for a question
  async retrieve(query: RAGQuery): Promise<RAGResponse> {
    const startTime = Date.now();

    try {
      console.log(`\n🔍 Searching for: "${query.question}"`);

      // Step 1: Convert question to embedding
      console.log("📊 Creating embedding...");
      const embedding = await embeddingService.getEmbedding(query.question);
     
      // Step 2: Search Pinecone with the embedding
      const topK = query.topK || 3; // Default to 5 medical passages
      console.log(`🔎 Querying Pinecone (topK=${topK})...`);
      const results = await queryPinecone(embedding, topK);

      // Step 3: Format response
      const elapsedTime = Date.now() - startTime;
      console.log(`✅ Found ${results.documents.length} documents in ${elapsedTime}ms`);

      return {
        query: query.question,
        retrievedDocuments: results.documents,
        scores: results.scores,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("❌ Error during retrieval:", error);
      throw error;
    }
  }

  // Retrieve and format for display with citations
  async retrieveWithCitations(query: RAGQuery): Promise<string> {
    const response = await this.retrieve(query);

    if (response.retrievedDocuments.length === 0) {
      return "No relevant medical information found.";
    }

    // Format results with citations
    let output = `Query: ${response.query}\n\n`;
    output += `Retrieved ${response.retrievedDocuments.length} passages:\n\n`;

    response.retrievedDocuments.forEach((doc, index) => {
      const score = response.scores[index];
      const metadata = doc.metadata;

      output += `--- Document ${index + 1} (Score: ${score.toFixed(3)}) ---\n`;
      
      // Include source metadata if available
      if (metadata?.source) output += `Source: ${metadata.source}\n`;
      if (metadata?.chapter) output += `Chapter: ${metadata.chapter}\n`;
      if (metadata?.page) output += `Page: ${metadata.page}\n`;
      
      output += `\nContent:\n${doc.content}\n\n`;
    });

    return output;
  }
}

// Export singleton instance
export const retrieverService = new RetrieverService();
