import { createEmbedding } from "../clients/embedding.client.js";
import { EmbeddingRequest } from "../types/rag.types.js";

// Service to handle embedding creation with validation and formatting
export class EmbeddingService {
  // Create embedding from text with validation
  async getEmbedding(text: string): Promise<number[]> {
    // Validate input
    if (!text || text.trim().length === 0) {
      throw new Error("Text cannot be empty");
    }

    // Create request object
    const request: EmbeddingRequest = {
      text: text.trim(),
    };

    // Call embedding client to create embedding
    const response = await createEmbedding(request);

    // Return just the embedding array
    return response.embedding;
  }

  // Batch create embeddings for multiple texts
  async getEmbeddings(texts: string[]): Promise<number[][]> {
    // Validate input
    if (!texts || texts.length === 0) {
      throw new Error("Texts array cannot be empty");
    }

    // Create embeddings for each text
    const embeddings = await Promise.all(
      texts.map((text) => this.getEmbedding(text))
    );

    return embeddings;
  }
}

// Export singleton instance to use across the app
export const embeddingService = new EmbeddingService();
