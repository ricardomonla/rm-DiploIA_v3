
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Use the Gemini API following official guidelines for initialization and content generation
export const analyzeVideoWithGemini = async (videoUrl: string) => {
  // Always initialize with the direct environment variable string
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    I have a YouTube video: ${videoUrl}.
    Generate a list of 5 key logical segments (moments) based on the content typically found in educational or instructional videos.
    Each segment should have a label (short), a timestamp (in seconds, starting from 0), and a brief description.
    Focus on structural parts: Intro, Core Theory, Case Study, Technical Demo, Conclusion.
    Return the response as a valid JSON object with an "annotations" array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            annotations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  timestamp: { type: Type.INTEGER },
                  label: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["id", "timestamp", "label", "description"]
              }
            }
          },
          required: ["annotations"]
        }
      },
    });

    // Fix: Access .text property directly (do not call as a method)
    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini");
    }

    const result = JSON.parse(text);
    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return mock fallback for demo if API fails
    return {
      annotations: [
        { id: 'm1', timestamp: 0, label: 'Session Kickoff', description: 'Opening and context setting.' },
        { id: 'm2', timestamp: 35, label: 'Main Concept', description: 'Exploring the primary thesis.' },
        { id: 'm3', timestamp: 88, label: 'Detailed Breakdown', description: 'Deep dive into specifics.' },
        { id: 'm4', timestamp: 155, label: 'Results & Summary', description: 'Final takeaways and recap.' },
      ]
    };
  }
};
