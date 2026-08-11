import { geminiClient } from '../../../utils/gemini.client';
import { env } from '../../../config/env';
import { ICareerContextSnapshot, IAssistantMessage } from '../career-assistant.types';
import { AppError } from '../../../utils/AppError';
import { z } from 'zod';
import { withRetry } from '../../../utils/retry';

const ResponseSchema = z.object({
  answer: z.string(),
  recommendations: z.array(z.object({
    title: z.string(),
    description: z.string(),
    priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
    category: z.enum(['SKILL', 'RESUME', 'JOB', 'INTERVIEW', 'LEARNING'])
  })).default([]),
  nextActions: z.array(z.string()).default([])
});

export class GeminiCareerAssistantProvider {
  async generateCareerResponse(
    context: ICareerContextSnapshot,
    userMessage: string,
    conversationHistory: IAssistantMessage[]
  ) {
    const prompt = this.buildPrompt(context, userMessage, conversationHistory);
    
    try {
      const result = await withRetry(() => 
        geminiClient.models.generateContent({
          model: env.GEMINI_MODEL || 'gemini-2.5-flash',
          contents: prompt
        }),
        3, 1000, 15000 // 3 retries, 1s backoff, 15s timeout
      );
      
      let text = result.text || '';
      
      // Clean up markdown wrapping if present
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const parsed = JSON.parse(text);
      const validated = ResponseSchema.parse(parsed);

      return {
        answer: validated.answer,
        recommendations: validated.recommendations,
        nextActions: validated.nextActions,
        tokens: {
          prompt: result.usageMetadata?.promptTokenCount || 0,
          completion: result.usageMetadata?.candidatesTokenCount || 0,
          total: result.usageMetadata?.totalTokenCount || 0
        }
      };
    } catch (error) {
      console.error('Gemini Provider Error:', error);
      throw new AppError('Failed to generate career response', 500);
    }
  }

  private buildPrompt(context: ICareerContextSnapshot, userMessage: string, history: IAssistantMessage[]) {
    return `
You are an expert AI Career Coach for CareerForge AI. 
Provide practical, actionable recommendations based ONLY on the user's available career data.
Do NOT invent experience or skills for the user. Be concise and professional.
Avoid generic motivational responses.

USER CAREER CONTEXT:
${JSON.stringify(context, null, 2)}

CONVERSATION HISTORY (Last few messages):
${history.map(m => `${m.role}: ${m.content}`).join('\n')}

NEW USER MESSAGE:
${userMessage}

Respond strictly with a valid JSON object matching this structure:
{
  "answer": "Your detailed coaching response to the user's message...",
  "recommendations": [
    {
      "title": "Short title",
      "description": "Specific actionable advice",
      "priority": "HIGH" | "MEDIUM" | "LOW",
      "category": "SKILL" | "RESUME" | "JOB" | "INTERVIEW" | "LEARNING"
    }
  ],
  "nextActions": [
    "Identify Skill Gaps", "Improve Resume", "Practice Mock Interview", "Review Job Applications"
  ]
}
`;
  }
}
