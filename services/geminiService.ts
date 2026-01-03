import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const sendMessageToGemini = async (
  history: ChatMessage[],
  newMessage: string,
  context: string
): Promise<string> => {
  if (!apiKey) {
    return "Error: API Key is missing. Please configure process.env.API_KEY.";
  }

  try {
    const model = 'gemini-3-flash-preview';
    
    // Construct a prompt that includes context about the current circuit simulation
    const systemInstruction = `You are a helpful and enthusiastic physics tutor specializing in electrical circuits. 
    The user is currently interacting with a circuit simulation.
    
    Context Information:
    ${context}
    
    Answer the user's questions clearly and concisely. If they ask about the current simulation, use the provided context values (Voltage, Resistance, Current) to explain. Use analogies (like water flow) where helpful. Keep responses relatively short (under 150 words) unless asked for a detailed derivation. Format math nicely using text, e.g., "V = I * R".`;

    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction,
      },
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      })),
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error connecting to the AI tutor.";
  }
};