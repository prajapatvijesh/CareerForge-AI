import { GoogleGenAI } from '@google/genai';
import { env } from './src/config/env';

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: "Hello",
    });
    console.log("Success with gemini-3.5-flash:", response.text);
  } catch (err) {
    console.error("Error with gemini-3.5-flash:", err);
  }
}
test();
