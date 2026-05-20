// RAG controller - Handle HTTP requests and call the RAG agent

import { Request, Response, NextFunction } from "express";
import { ragAgent } from "../../agents/rag.agent.js";
import { AskRequest, AskResponse, HealthResponse } from "../types.js";

/**
 * Handle POST /api/ask requests
 * Accepts a medical question and returns AI-generated answer with sources
 */
export async function askQuestion(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { question } = req.body as AskRequest;

    console.log(`Processing question: "${question}"`);

    // Call the RAG agent with default topK=5 (internal parameter)
    const result = await ragAgent.answerQuestion(question, 5);

    // Format response according to AskResponse interface
    const response: AskResponse = {
      question: result.query,
      answer: result.answer,
      sources: result.retrievedDocuments.map((doc, index) => ({
        id: doc.id,
        content: doc.content,
        metadata: doc.metadata,
        score: result.scores[index],
      })),
      timestamp: result.timestamp,
    };

    res.status(200).json(response);
  } catch (error) {
    // Pass error to error middleware
    next(error);
  }
}

/**
 * Handle GET /api/health requests
 * Returns service status
 */
export function getHealth(req: Request, res: Response): void {
  const response: HealthResponse = {
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Medical RAG API",
  };

  res.status(200).json(response);
}
