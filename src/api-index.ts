// API entry point - Start the Express server

import { createServer } from "./api/server.js";

// Get port from environment or use default
const PORT = process.env.PORT || 3000;

// Create and start the server
const app = createServer();

app.listen(PORT, () => {
  console.log("\n🚀 Medical RAG API Server Started!");
  console.log(`📍 Server running on: http://localhost:${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💬 Ask endpoint: POST http://localhost:${PORT}/api/ask`);
  console.log("\n✨ Test your API directly in the browser at /api-docs");
  console.log("Press Ctrl+C to stop\n");
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("\n⚠️  SIGTERM received, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("\n⚠️  SIGINT received, shutting down gracefully...");
  process.exit(0);
});
