import { GoogleGenAI } from '@google/genai';
import { env } from './src/config/env';

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

async function listModels() {
  try {
    const response = await ai.models.list();
    for await (const model of response) {
      console.log(model.name);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}
listModels();
