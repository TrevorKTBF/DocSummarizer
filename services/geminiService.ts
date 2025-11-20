import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProcessedData } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in the environment.");
  }
  return new GoogleGenAI({ apiKey });
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    extractedText: {
      type: Type.STRING,
      description: "The full raw text extracted from the image or input.",
    },
    summaryPoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A concise summary of the content in bullet points.",
    },
    folderName: {
      type: Type.STRING,
      description: "A short, 2-4 word creative category title for this content (e.g., 'Receipts', 'Meeting Notes', 'Design Ideas').",
    },
  },
  required: ["extractedText", "summaryPoints", "folderName"],
};

export const analyzeContent = async (
  textInput: string,
  imageBase64?: string,
  mimeType: string = "image/jpeg"
): Promise<ProcessedData> => {
  const ai = getAiClient();

  const parts: any[] = [];

  if (imageBase64) {
    // Remove data URL prefix if present (e.g., "data:image/png;base64,")
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    
    parts.push({
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    });
  }

  if (textInput) {
    parts.push({
      text: textInput,
    });
  }

  if (parts.length === 0) {
    throw new Error("No content provided to analyze.");
  }

  const prompt = `
    Analyze the provided content (image and/or text). 
    1. Extract all legible text verbatim.
    2. Summarize the main points into a clear, bulleted list.
    3. Generate a short, relevant folder category name for organizing this content.
    Return the result in JSON format.
  `;

  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are an intelligent digital archivist. Your goal is to digitize, summarize, and categorize information accurately.",
      },
    });

    if (!response.text) {
      throw new Error("No response text received from Gemini.");
    }

    const parsedResponse = JSON.parse(response.text) as ProcessedData;
    return parsedResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};