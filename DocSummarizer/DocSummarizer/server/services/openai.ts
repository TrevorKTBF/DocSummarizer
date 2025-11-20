import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

export async function summarizeText(text: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Please create a clear, concise summary of the following text in 2-6 sentences that captures the key points and main ideas:\n\n${text}`
        }
      ],
      max_tokens: 500,
    });

    const summary = response.choices[0].message.content?.trim();
    return summary || "Unable to generate summary";
  } catch (error) {
    console.error("OpenAI summarization error:", error);
    throw new Error("Failed to generate summary. Please try again.");
  }
}
