import { IQuestionGenerator, IFeedbackEvaluator, IQuestion, IAIUsageMetrics } from './ai-provider.interface';
import { geminiClient } from '../../../utils/gemini.client';
import { withRetry } from '../../../utils/retry';
import { env } from '../../../config/env';
import { z } from 'zod';
import crypto from 'crypto';

const questionSchema = z.object({
  questions: z.array(z.object({
    text: z.string(),
    type: z.enum(['TECHNICAL', 'BEHAVIORAL'])
  }))
});

const evaluationSchema = z.object({
  answersFeedback: z.record(z.string(), z.object({
    score: z.number().min(0).max(10),
    feedback: z.string()
  })),
  overallResult: z.object({
    totalScore: z.number().min(0).max(100),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    suggestions: z.array(z.string())
  })
});

export class GeminiQuestionGenerator implements IQuestionGenerator {
  public async generateQuestions(role: string, difficulty: string, company?: string, count: number = 5): Promise<{ questions: IQuestion[], usage: IAIUsageMetrics }> {
    const prompt = `
You are an expert technical interviewer. Generate ${count} interview questions for a ${role} candidate.
Difficulty level: ${difficulty}.
${company ? `Target company context: ${company}` : ''}

Provide a mix of technical and behavioral questions.
Your response must be ONLY valid JSON matching this schema exactly. No markdown formatting. Ensure all quotes inside strings are properly escaped.
{
  "questions": [
    {
      "text": "The question text",
      "type": "TECHNICAL" // or "BEHAVIORAL"
    }
  ]
}
`;

    const startTime = Date.now();
    try {
      const response = await withRetry(() => 
        geminiClient.models.generateContent({
          model: env.GEMINI_MODEL,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          }
        }),
        3, 1000, 30000
      );

      const latencyMs = Date.now() - startTime;
      const text = response.text || '';
      
      let jsonString = text.trim();
      if (jsonString.startsWith('```json')) jsonString = jsonString.replace(/^```json\s*/i, '');
      else if (jsonString.startsWith('```')) jsonString = jsonString.replace(/^```\s*/, '');
      if (jsonString.endsWith('```')) jsonString = jsonString.replace(/\s*```$/, '');

      let parsedData;
      try {
        parsedData = JSON.parse(jsonString);
      } catch (err) {
        console.error("RAW JSON STRING FAILED TO PARSE:", jsonString);
        throw err;
      }
      const validatedData = questionSchema.parse(parsedData);
      
      const usageMetadata = response.usageMetadata;
      const promptTokens = usageMetadata?.promptTokenCount || 0;
      const completionTokens = usageMetadata?.candidatesTokenCount || 0;
      
      const usage: IAIUsageMetrics = {
        provider: 'gemini',
        model: env.GEMINI_MODEL,
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
        latencyMs,
        // Approximate cost: 2.5 flash is ~$0.075 per 1M input tokens, ~$0.30 per 1M output tokens
        estimatedCostUsd: ((promptTokens / 1000000) * 0.075) + ((completionTokens / 1000000) * 0.3)
      };

      const questions = validatedData.questions.map(q => ({
        id: crypto.randomUUID(),
        text: q.text,
        type: q.type
      }));

      return { questions, usage };
    } catch (error: any) {
      console.error('Gemini Question Generation Error:', error);
      throw new Error(`Failed to generate questions with Gemini: ${error.message}`);
    }
  }
}

export class GeminiFeedbackEvaluator implements IFeedbackEvaluator {
  public async evaluateAnswers(qaList: { question: string; answer: string }[]) {
    const prompt = `
You are an expert technical interviewer evaluating a candidate's interview performance.
You will be provided with a list of questions and the candidate's corresponding answers.

Evaluate each answer out of 10 and provide brief feedback. Then, provide an overall evaluation.
Your response must be ONLY valid JSON matching this schema exactly. No markdown formatting. Ensure all quotes inside strings are properly escaped.

{
  "answersFeedback": {
    "0": {
      "score": 8,
      "feedback": "Good answer but missed..."
    }
    // keys must be the index of the question in the array as a string ("0", "1", "2", ...)
  },
  "overallResult": {
    "totalScore": 85,
    "strengths": ["string"],
    "weaknesses": ["string"],
    "suggestions": ["string"]
  }
}

Input QA List:
${JSON.stringify(qaList, null, 2)}
`;

    const startTime = Date.now();
    try {
      const response = await withRetry(() => 
        geminiClient.models.generateContent({
          model: env.GEMINI_MODEL,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          }
        }),
        3, 1000, 30000
      );

      const latencyMs = Date.now() - startTime;
      const text = response.text || '';
      
      let jsonString = text.trim();
      if (jsonString.startsWith('```json')) jsonString = jsonString.replace(/^```json\s*/i, '');
      else if (jsonString.startsWith('```')) jsonString = jsonString.replace(/^```\s*/, '');
      if (jsonString.endsWith('```')) jsonString = jsonString.replace(/\s*```$/, '');

      let parsedData;
      try {
        parsedData = JSON.parse(jsonString);
      } catch (err) {
        console.error("RAW JSON STRING FAILED TO PARSE:", jsonString);
        throw err;
      }
      const validatedData = evaluationSchema.parse(parsedData);
      
      const usageMetadata = response.usageMetadata;
      const promptTokens = usageMetadata?.promptTokenCount || 0;
      const completionTokens = usageMetadata?.candidatesTokenCount || 0;
      
      const usage: IAIUsageMetrics = {
        provider: 'gemini',
        model: env.GEMINI_MODEL,
        promptTokens,
        completionTokens,
        totalTokens: promptTokens + completionTokens,
        latencyMs,
        estimatedCostUsd: ((promptTokens / 1000000) * 0.075) + ((completionTokens / 1000000) * 0.3)
      };

      return {
        answersFeedback: validatedData.answersFeedback,
        overallResult: validatedData.overallResult,
        usage
      };
    } catch (error: any) {
      console.error('Gemini Feedback Evaluation Error:', error);
      throw new Error(`Failed to evaluate answers with Gemini: ${error.message}`);
    }
  }
}
