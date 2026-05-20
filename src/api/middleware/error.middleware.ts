// Error middleware - Handle errors and return proper HTTP responses

import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../types.js";

/**
 * Global error handler middleware
 * Catches any errors thrown in the application and returns a formatted JSON response
 * This should be the LAST middleware added to the Express app
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error("Error occurred:", error);

  // Determine status code (default to 500 for unknown errors)
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  const errorResponse: ErrorResponse = {
    error: error.message || "Internal server error",
    details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    timestamp: new Date().toISOString(),
  };

  res.status(statusCode).json(errorResponse);
}