# CLAUDE.md

## Project Name

Medical RAG Agent with TypeScript, Groq, and Pinecone

## Project Goal

We are building a medical chat-enabled RAG (Retrieval-Augmented Generation) agent using TypeScript.

**Use Case:** A medical question-answering system powered by a medical textbook.

The agent should:

1. Receive a medical question from the user.
2. Convert the question into an embedding (semantic vector).
3. Search Pinecone using the embedding to find relevant textbook sections.
4. Retrieve the most relevant medical documents/passages from Pinecone.
5. Return the retrieved results with source citations.
6. Later, generate a final AI answer using the retrieved medical context.

**Data Source:** Medical textbook content (chunked into sections/passages)

We are building this project step by step. Do not generate the full project at once unless specifically requested.

---

## Medical RAG Considerations

This is a domain-specific RAG system for medical information:

**Data Handling:**
- Source: Medical textbook
- Chunking: Sections/passages should preserve medical context
- Metadata: Include chapter, page number, section title for citations

**Retrieval Quality:**
- `topK`: Retrieve 5-10 documents for comprehensive answers
- Embedding model: `all-MiniLM-L6-v2` (384 dimensions)
- Pinecone index must match 384 dimensions

**Response Format:**
- Cite sources (chapter, page, section)
- Evidence-based answers from retrieved textbook content
- Clear, accurate medical terminology

---

## Important Instruction to the AI Assistant

You are helping a beginner learn TypeScript while building this project.

Always explain what you are doing before writing code.

Do not rush.

Build the project one step at a time.

For every new file or concept, explain:

- What the file is for.
- Why the file is needed.
- How it connects to the rest of the project.
- Any TypeScript concept being used.

The user is learning TypeScript for the first time, so keep explanations simple and practical.

---

## Technology Stack

Use the following technologies:

- TypeScript
- Node.js
- **Groq SDK** - LLM for generating medical answers (`llama-3.1-8b-instant`)
- **Hugging Face Transformers** - Sentence transformer for embeddings (`all-MiniLM-L6-v2`)
- **Pinecone TypeScript SDK** - Vector database for medical document retrieval
- dotenv for environment variables
- tsx for running TypeScript during development

**Important:** Do not use LangChain in the first version.

The user should first understand the raw implementation before introducing frameworks.

---

## Recommended Project Structure

Use this folder structure:

```txt
rag-agent-typescript/
│
├── CLAUDE.md
├── package.json
├── tsconfig.json
├── .env
├── .env.example
├── .gitignore
│
├── src/
│   ├── index.ts
│   │
│   ├── config/
│   │   └── env.ts
│   │
│   ├── clients/
│   │   ├── embedding.client.ts  # Sentence transformer for embeddings
│   │   ├── groq.client.ts       # Groq LLM for chat
│   │   └── pinecone.client.ts   # Pinecone vector database
│   │
│   ├── services/
│   │   ├── embedding.service.ts
│   │   └── retriever.service.ts
│   │
│   ├── agents/
│   │   └── rag.agent.ts
│   │
│   └── types/
│       └── rag.types.ts
│
└── scripts/
    └── upsert-docs.ts  # Load medical textbook into Pinecone




## Step-by-Step Approach

Here's the logical order to build this medical RAG agent:

1. **Setup Foundation** - package.json, dependencies, .env files
2. **Environment Config** - env.ts to safely load environment variables
3. **Type Definitions** - rag.types.ts to define TypeScript types
4. **Pinecone Client** - pinecone.client.ts to connect to Pinecone vector database
5. **Embedding Client** - embedding.client.ts for sentence transformers (local embeddings)
6. **Groq Client** - groq.client.ts for LLM chat completions
7. **Embedding Service** - embedding.service.ts to convert text to embeddings
8. **Retriever Service** - retriever.service.ts to search Pinecone with medical context
9. **RAG Agent** - rag.agent.ts to coordinate retrieval and response generation
10. **Entry Point** - index.ts to run the medical chat agent
11. **Upsert Script** - upsert-docs.ts to load medical textbook chunk
Upsert Script - upsert-docs.ts to load documents into Pinecone