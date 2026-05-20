// Type definitions for RAG system - Documents, queries, embeddings, and responses

// Represents a document stored in Pinecone
export interface Document {
  id: string;
  content: string;
  metadata?: {
    source?: string;
    date?: string;
    [key: string]: any;
  };
}

// Results from searching Pinecone
export interface QueryResult {
  documents: Document[];
  scores: number[]; // 0-1, higher = more relevant
}

// Convert text to embedding
export interface EmbeddingRequest {
  text: string;
}

export interface EmbeddingResponse {
  embedding: number[];
}

// User input to RAG agent
export interface RAGQuery {
  question: string;
  topK?: number; // How many documents to retrieve
}

// Final response from RAG agent
export interface RAGResponse {
  query: string;
  retrievedDocuments: Document[];
  scores: number[];
  timestamp: Date;
}
