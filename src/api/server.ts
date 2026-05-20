// Express server setup - Initialize and configure the API server

import express, { Express } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import ragRoutes from "./routes/rag.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { swaggerSpec } from "./swagger.config.js";

/**
 * Creates and configures the Express application
 * @returns Configured Express app
 */
export function createServer(): Express {
  const app = express();

  // Middleware - Order matters!
  
  // 1. CORS - Allow cross-origin requests (e.g., from frontend on different port)
  app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",  // In production, specify exact origin
    credentials: true,
  }));

  // 2. JSON parser - Parse incoming JSON request bodies
  app.use(express.json());

  // 3. Request logging (simple version)
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });

  // 4. Swagger API Documentation
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Medical RAG API Documentation",
  }));

  // 5. Routes - Mount API routes under /api prefix
  app.use("/api", ragRoutes);

  // 6. 404 handler - Handle unknown routes
  app.use((req, res) => {
    res.status(404).json({
      error: "Route not found",
      details: `Cannot ${req.method} ${req.path}`,
      timestamp: new Date().toISOString(),
    });
  });

  // 7. Error handler - MUST be last middleware
  app.use(errorHandler);

  return app;
}
