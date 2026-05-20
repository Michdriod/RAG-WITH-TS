// RAG Agent - Combines retrieval + LLM generation for medical Q&A

import { retrieverService } from "../services/retriever.service.js";
import { generateResponse } from "../clients/groq.client.js";
import { RAGQuery, Document } from "../types/rag.types.js";

interface RAGResult {
  query: string;
  answer: string;
  retrievedDocuments: Document[];
  scores: number[];
  timestamp: string;
}

export class RAGAgent {
  // Answer medical questions using RAG
  async answerQuestion(
    question: string,
    topK: number = 5,
    temperature: number = 0.3
  ): Promise<RAGResult> {
    try {
      console.log("\n🏥 Medical RAG Agent Starting...\n");

      // Step 1: Retrieve relevant medical passages
      const query: RAGQuery = { question, topK };
      const retrievalResponse = await retrieverService.retrieve(query);

      if (retrievalResponse.retrievedDocuments.length === 0) {
        return {
          query: question,
          answer: "I couldn't find relevant medical information to answer your question. Please try rephrasing or consult a healthcare professional.",
          retrievedDocuments: [],
          scores: [],
          timestamp: new Date().toISOString(),
        };
      }

      // Step 2: Format retrieved context for LLM
      const context = this.formatContext(retrievalResponse);

      // Step 3: Create system and user prompts
      const systemPrompt = this.createSystemPrompt();
      const userPrompt = this.createUserPrompt(question, context);

      // Step 4: Generate answer using LLM
      console.log("🤖 Generating answer with Groq LLM...");
      const answer = await generateResponse(systemPrompt, userPrompt, temperature);

      console.log("✅ Answer generated successfully!\n");

      return {
        query: question,
        answer,
        retrievedDocuments: retrievalResponse.retrievedDocuments,
        scores: retrievalResponse.scores,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("❌ Error in RAG Agent:", error);
      throw error;
    }
  }

  // Format retrieved documents into context string
  private formatContext(retrievalResponse: any): string {
    let context = "";

    retrievalResponse.retrievedDocuments.forEach((doc: any, index: number) => {
      const score = retrievalResponse.scores[index];
      const metadata = doc.metadata || {};

      context += `[Document ${index + 1}] (Relevance: ${score.toFixed(3)})\n`;
      
      if (metadata.source) context += `Source: ${metadata.source}\n`;
      if (metadata.chapter) context += `Chapter: ${metadata.chapter}\n`;
      if (metadata.page) context += `Page: ${metadata.page}\n`;
      
      context += `Content: ${doc.content}\n\n`;
    });

    return context;
  }

  // Create system prompt for medical RAG
  private createSystemPrompt(): string {
    return `You are a medical knowledge assistant that answers questions based on medical textbook content.

    Instructions:
    - Answer questions using ONLY the information provided in the retrieved documents
    - Provide clear, natural, and conversational answers without citing document numbers or pages
    - Use proper medical terminology
    - If the retrieved information doesn't contain the answer, say so
    - Do not make assumptions or add information not present in the documents
    - Write your answer as if explaining to a patient or student, without academic citations`;
  }

  // Create user prompt with question and context
  private createUserPrompt(question: string, context: string): string {
    return `Based on the following medical textbook excerpts, please answer the question.

    RETRIEVED MEDICAL INFORMATION:
    ${context}

    QUESTION: ${question}

    Please provide a clear, comprehensive answer. Write naturally without including document numbers or page references in your response.`;
  }

  // Simple Q&A without full answer generation (just retrieval)
  async retrieveOnly(question: string, topK: number = 5): Promise<string> {
    const query: RAGQuery = { question, topK };
    return await retrieverService.retrieveWithCitations(query);
  }
}

// Export singleton instance
export const ragAgent = new RAGAgent();
