import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env';

// Singleton client instance
export const geminiClient = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});
