// Medical RAG Agent - Entry Point

import { ragAgent } from "./agents/rag.agent.js";

async function main() {
  try {
    console.log("=".repeat(60));
    console.log("🏥 MEDICAL RAG AGENT - TypeScript + Groq + Pinecone");
    console.log("=".repeat(60));

    // Example medical question
    // const question = "When chemotherapy is used before surgery or radiation, it is known as?";
    const question = "What is chemotherapy?";

    console.log(`\n📝 Question: ${question}\n`);

    // Option 1: Full RAG with LLM answer generation
    console.log("Mode: Full RAG (Retrieval + Generation)\n");
    const result = await ragAgent.answerQuestion(question, 5, 0.3);

    console.log("=".repeat(60));
    console.log("💬 ANSWER:");
    console.log("=".repeat(60));
    console.log(result.answer);
    console.log("\n📚 Sources:", result.retrievedDocuments.length, "documents");
    console.log("=".repeat(60));

    // Option 2: Retrieval-only mode (uncomment to test)
    /*
    console.log("\n\nMode: Retrieval-Only (No LLM)\n");
    const retrievalResults = await ragAgent.retrieveOnly(question, 5);
    console.log(retrievalResults);
    */

  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  }
}

// Run the agent
main();
