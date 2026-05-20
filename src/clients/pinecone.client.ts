import { Pinecone } from "@pinecone-database/pinecone";
import { config } from "../config/env.js";
import { Document, QueryResult } from "../types/rag.types.js";

// Initialize Pinecone client with API key from environment variables
const pinecone = new Pinecone({ apiKey: config.PINECONE_API_KEY});

// Get reference to the Pinecone index with namespace
const index = pinecone.Index(config.PINECONE_INDEX_NAME).namespace(config.PINECONE_NAMESPACE);

// Search Pinecone for documents similar to the embedding
export async function queryPinecone(
  embedding: number[],
  topK: number = 5
): Promise<QueryResult> {
  try {
    // Query the index with the embedding
    const results = await index.query({
      vector: embedding,
      topK: topK,
      includeMetadata: true,
    });

    // Transform Pinecone results into our Document format
    const documents: Document[] = results.matches.map((match: any) => ({
      id: match.id,
      content: match.metadata?.content || "",
      metadata: match.metadata,
    }));

    // Extract scores
    const scores = results.matches.map((match: any) => match.score || 0);

    return {
      documents,
      scores,
    };
  } catch (error) {
    console.error("Error querying Pinecone:", error);
    throw error;
  }
}
