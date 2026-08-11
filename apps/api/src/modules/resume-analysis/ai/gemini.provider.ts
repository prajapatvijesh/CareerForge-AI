import { IAIProvider, IAnalysisResult } from './ai-provider.interface';
import { geminiClient } from '../../../utils/gemini.client';
import { withRetry } from '../../../utils/retry';
import { env } from '../../../config/env';
import { z } from 'zod';

const analysisSchema = z.object({
  atsScore: z.number().min(0).max(100),
  keywords: z.object({
    present: z.array(z.string()),
    missing: z.array(z.string()),
  }),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  suggestions: z.array(z.string()),
});

export class GeminiResumeProvider implements IAIProvider {
  public async analyzeResume(resumeText: string, jobDescription?: string): Promise<IAnalysisResult> {
    const prompt = `
You are an expert ATS (Applicant Tracking System) and Senior Technical Recruiter.
Analyze the following resume JSON/Text and provide a strict JSON response.
If a job description is provided, tailor the ATS score and keywords analysis to that specific job.
Otherwise, provide a general analysis for a software engineering role.
Ensure you provide at least 2 strengths, 2 weaknesses, and 2 actionable suggestions.

Resume:
${resumeText}

Job Description (if any):
${jobDescription || 'N/A'}

Your response must be ONLY valid JSON matching this schema exactly. No markdown formatting, no comments, no extra text. Ensure all quotes inside strings are properly escaped.
{
  "atsScore": 0-100,
  "keywords": {
    "present": ["matched keyword 1"],
    "missing": ["missing keyword 1"]
  },
  "strengths": ["strength 1"],
  "weaknesses": ["weakness 1"],
  "suggestions": ["actionable suggestion 1"]
}
`;

    try {
      const startTime = Date.now();
      const response = await withRetry(() => 
        geminiClient.models.generateContent({
          model: env.GEMINI_MODEL,
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2, // Low temperature for deterministic analysis
          }
        }), 
        3, // maxRetries
        1000, // baseDelayMs
        30000 // timeoutMs (30s)
      );

      const latencyMs = Date.now() - startTime;
      const text = response.text || '';
      
      // Attempt to parse JSON safely. Sometimes LLMs return markdown blocks even if instructed not to.
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
      
      // Validate using Zod
      const validatedData = analysisSchema.parse(parsedData);
      
      const usageMetadata = response.usageMetadata;
      const promptTokens = usageMetadata?.promptTokenCount || 0;
      const completionTokens = usageMetadata?.candidatesTokenCount || 0;
      const totalTokens = usageMetadata?.totalTokenCount || 0;
      
      // Rough estimation for flash models
      const estimatedCostUsd = (promptTokens * 0.075 / 1000000) + (completionTokens * 0.30 / 1000000);

      return {
        ...validatedData,
        usage: {
          provider: 'gemini',
          model: env.GEMINI_MODEL,
          promptTokens,
          completionTokens,
          totalTokens,
          latencyMs,
          estimatedCostUsd
        }
      };

    } catch (error: any) {
      console.error('Gemini Resume Analysis Error:', error);
      throw new Error(`Failed to analyze resume with Gemini: ${error.message}`);
    }
  }
}
