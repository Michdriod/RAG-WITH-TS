import Groq from "groq-sdk";
import { config } from "../config/env.js";

// Initialize Groq client for LLM chat
const groq = new Groq({ apiKey: config.GROQ_API_KEY });

// Generate text response using Groq LLM
export async function generateResponse(
  systemPrompt: string,
  userPrompt: string,
  temperature: number = 0.7
): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature,
      max_tokens: 1024,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
}

export { groq };

