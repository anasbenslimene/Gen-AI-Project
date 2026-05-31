import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../config/config";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function generateAnswer(query, relevantChunks) {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_API_KEY") {
    throw new Error("API Key is missing or invalid. Please update src/config/config.js with your Gemini API Key.");
  }

  try {
    // We use gemini-2.5-flash as the requested model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Construct the RAG prompt
    let contextText = relevantChunks.map((chunk, index) => 
      `[Source ${index + 1}, Page ${chunk.pageNumber}]:\n${chunk.text}`
    ).join('\n\n');

    const prompt = `You are EduBot, an AI-powered educational assistant. 
Your goal is to help students learn faster by answering their questions based ONLY on the provided course material.

Here is the relevant context retrieved from the student's uploaded PDF document:
-----------------------
${contextText}
-----------------------

User Question: ${query}

Instructions:
1. Answer the user's question accurately using ONLY the context provided above.
2. If the answer is not contained in the context, politely state that you cannot find the answer in the uploaded document.
3. Be helpful, concise, and format your response beautifully using markdown (bullet points, bold text, etc. where appropriate).
4. Do not mention that you are reading from "Source 1" or "Page X" directly in every sentence, but you can add a brief reference if helpful.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating answer with Gemini:", error);
    throw error;
  }
}
