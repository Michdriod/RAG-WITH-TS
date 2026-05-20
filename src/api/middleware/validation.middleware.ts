// Validation middleware - Validate incoming request data

import { Request, Response, NextFunction } from "express";

/**
 * Validates the POST /api/ask request body
 * Checks that:
 * - Request body exists
 * - question field is present
 * - question is a non-empty string
 */
export function validateAskRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { question } = req.body;

  // Check if question exists
  if (!question) {
    res.status(400).json({
      error: "Question is required",
      details: "Request body must include a 'question' field",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Check if question is a string
  if (typeof question !== "string") {
    res.status(400).json({
      error: "Invalid question type",
      details: "Question must be a string",
      errorTime: new Date().toISOString(),
    });
    return;
  }

  // Check if question is not empty or just whitespace
  if (question.trim().length === 0) {
    res.status(400).json({
      error: "Question cannot be empty",
      details: "Question must contain at least one character",
      errorTime: new Date().toISOString(),
    });
    return;
  }

  // All validations passed - move to next middleware/controller
  next();
}
