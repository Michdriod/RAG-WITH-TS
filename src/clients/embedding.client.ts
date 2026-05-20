// Embedding client for RAG - Converts text to vectors for semantic search in Pinecone

import { EmbeddingRequest, EmbeddingResponse } from "../types/rag.types.js";

// Model configuration for RAG - Using local pipeline with WASM backend
export const EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2";
export const EMBEDDING_DIMENSION = 384; // Must match Pinecone index dimension

let embeddingPipeline: any = null;
let transformersModule: any = null;

// Initialize transformers with WASM configuration using dynamic import
async function initializeTransformers() {
  if (!transformersModule) {
    // Dynamic import to delay loading until needed
    const { pipeline, env } = await import("@huggingface/transformers");
    
    transformersModule = { pipeline, env };
    console.log("✓ Transformers initialized");
  }
  return transformersModule;
}

// Initialize and cache the embedding pipeline
async function getEmbeddingPipeline() {
  if (!embeddingPipeline) {
    console.log(`Loading embedding model: ${EMBEDDING_MODEL}...`);
    const { pipeline } = await initializeTransformers();
    embeddingPipeline = await pipeline("feature-extraction", EMBEDDING_MODEL);
    console.log("✓ Embedding model loaded successfully");
  }
  return embeddingPipeline;
}

// Convert text to embedding vector for semantic search
export async function createEmbedding(
  request: EmbeddingRequest
): Promise<EmbeddingResponse> {
  try {
    console.log(`Creating embedding for text: "${request.text.substring(0, 50)}..."`);
    
    const extractor = await getEmbeddingPipeline();

    // Generate embedding with mean pooling and normalization
    const output = await extractor(request.text, {
      pooling: "mean",
      normalize: true,
    });

    // Convert tensor to array
    const embeddingArray = Array.from(output.data) as number[];
    
    if (!embeddingArray.every((item) => typeof item === 'number')) {
      throw new Error('Embedding output contains non-number values');
    }

    // Validate embedding dimension
    if (embeddingArray.length !== EMBEDDING_DIMENSION) {
      throw new Error(
        `Expected ${EMBEDDING_DIMENSION} dimensions, got ${embeddingArray.length}`
      );
    }

    console.log(`✓ Created ${EMBEDDING_DIMENSION}D embedding vector`);
    return { embedding: embeddingArray };
  } catch (error) {
    console.error("Error creating embedding:", error);
    throw error;
  }
}
