// RAG routes - Define API endpoints for the Medical RAG agent

import { Router } from "express";
import { askQuestion, getHealth } from "../controllers/rag.controller.js";
import { validateAskRequest } from "../middleware/validation.middleware.js";

// Create Express router
const router = Router();

/**
 * @swagger
 * /api/ask:
 *   post:
 *     summary: Ask a medical question
 *     description: Submit a medical question and receive an AI-generated answer with relevant source citations from medical textbooks
 *     tags: [Medical]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *                 description: Your medical question
 *                 example: "What is chemotherapy?"
 *     responses:
 *       200:
 *         description: Successful response with answer and sources
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 question:
 *                   type: string
 *                   example: "What is chemotherapy?"
 *                 answer:
 *                   type: string
 *                   example: "Chemotherapy is a type of cancer treatment that uses drugs to destroy cancer cells..."
 *                 sources:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       content:
 *                         type: string
 *                       metadata:
 *                         type: object
 *                       score:
 *                         type: number
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bad request - invalid or missing question
 *       500:
 *         description: Internal server error
 */
router.post("/ask", validateAskRequest, askQuestion);

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     description: Check if the Medical RAG API service is running and operational
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 service:
 *                   type: string
 *                   example: "Medical RAG API"
 */
router.get("/health", getHealth);

export default router;
