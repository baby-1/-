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
    // Updated for Bilingual (English + Chinese) support
    const systemInstruction = `You are a helpful and enthusiastic physics tutor specializing in electrical circuits. 
    The user is currently interacting with a circuit simulation.
    
    Context Information:
    ${context}
    
    **Instructions:**
    1. Answer the user's questions clearly and concisely.
    2. **Bilingual Output**: Provide your main response in English, but include key terms or a brief summary in Chinese (中文).
       - Example: "The current increases because resistance decreases. (电阻减小导致电流增大。)"
    3. Use the provided context values (Voltage, Resistance, Current) to explain.
    4. Use analogies (like water flow) where helpful.
    5. Keep responses relatively short (under 150 words).
    6. Format math nicely using text, e.g., "V = I * R".`;

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
    return "Sorry, I encountered an error connecting to the AI tutor. (连接AI助教时出错)";
  }
};