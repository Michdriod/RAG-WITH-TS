// Swagger/OpenAPI configuration for API documentation

import swaggerJsdoc from "swagger-jsdoc";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Medical RAG API",
      version: "1.0.0",
      description: "A medical question-answering API powered by RAG (Retrieval-Augmented Generation) using TypeScript, Groq LLM, and Pinecone vector database",
      contact: {
        name: "API Support",
        email: "support@medicalrag.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    tags: [
      {
        name: "Medical",
        description: "Medical question answering endpoints",
      },
      {
        name: "Health",
        description: "Service health and status endpoints",
      },
    ],
  },
  apis: [join(__dirname, "./routes/*.ts")], // Absolute path to API route files
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
