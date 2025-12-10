import { GoogleGenAI } from "@google/genai";
import { AIServiceAction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = 'gemini-2.5-flash';

export const processWithAI = async (
  action: AIServiceAction,
  content: string
): Promise<string> => {
  if (!content.trim()) return "";

  let prompt = "";

  switch (action) {
    case AIServiceAction.AUTO_TITLE:
      prompt = `Generate a short, concise, and relevant title (max 6 words) for the following note content. Return ONLY the title text, no quotes or prefixes.\n\nNote Content:\n${content}`;
      break;
    case AIServiceAction.SUMMARIZE:
      prompt = `Summarize the following note into a concise list of bullet points. Return only the bullet points.\n\nNote Content:\n${content}`;
      break;
    case AIServiceAction.FIX_GRAMMAR:
      prompt = `Fix the grammar, spelling, and improve the flow of the following text while maintaining the original meaning. Return only the corrected text.\n\nText:\n${content}`;
      break;
    case AIServiceAction.CONTINUE_WRITING:
      prompt = `Continue writing this note naturally, adding 1-2 paragraphs that follow logically from the current context. Return only the added text.\n\nCurrent Content:\n${content}`;
      break;
    default:
      throw new Error("Unknown AI Action");
  }

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
