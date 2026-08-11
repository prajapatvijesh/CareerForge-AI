import { AnalysisRepository } from './analysis.repository';
import { MockResumeProvider } from './ai/mock.provider';
import { GeminiResumeProvider } from './ai/gemini.provider';
import { IAIProvider } from './ai/ai-provider.interface';
import { AppError } from '../../utils/AppError';
import { env } from '../../config/env';
import { ResumeRepository } from '../resume/resume.repository';
import { UsageService } from '../subscription/usage.service';

export class AnalysisService {
  private repository = new AnalysisRepository();
  private resumeRepository = new ResumeRepository();
  private usageService = new UsageService();
  
  // Strategy pattern map
  private providers: Record<string, IAIProvider> = {
    'gemini': new GeminiResumeProvider(),
    'mock': new MockResumeProvider(),
    // 'openai': new OpenAIProvider(),
  };

  public async triggerAnalysis(userId: string, resumeId: string, providerKey: string = env.AI_PROVIDER, jobDescription?: string) {
    // 1. Verify ownership of the resume
    const resume = await this.resumeRepository.findById(resumeId, userId);
    if (!resume) {
      throw new AppError('Resume not found or unauthorized', 404);
    }

    // 2. Select AI Provider
    const provider = this.providers[providerKey];
    if (!provider) {
      throw new AppError(`AI Provider '${providerKey}' not supported`, 400);
    }

    // 3. Create a PENDING analysis record
    const analysisRecord = await this.repository.create(userId, resumeId, providerKey);

    // 4. Fire and forget the async AI task so we don't block the HTTP request 
    // (In a real app, use a queue like BullMQ. For this MVP, we use an async IIFE)
    this.processAnalysisAsync(analysisRecord._id.toString(), resume, provider, jobDescription);

    return analysisRecord;
  }

  private async processAnalysisAsync(analysisId: string, resume: any, provider: IAIProvider, jobDescription?: string) {
    try {
      // Update status to processing
      await this.repository.updateStatus(analysisId, 'PROCESSING');

      // Convert resume JSON to a text block for the LLM
      const resumeText = JSON.stringify(resume.sections);

      // Call AI Provider
      const result = await provider.analyzeResume(resumeText, jobDescription);

      // Save results
      await this.repository.updateStatus(analysisId, 'COMPLETED', {
        atsScore: result.atsScore,
        keywords: result.keywords,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        suggestions: result.suggestions
      });

      if (result.usage) {
        await this.usageService.recordAIUsage({
          userId: resume.userId.toString(),
          feature: 'RESUME_ANALYSIS',
          provider: result.usage.provider,
          model: result.usage.model,
          promptTokens: result.usage.promptTokens,
          completionTokens: result.usage.completionTokens,
          totalTokens: result.usage.totalTokens,
          latencyMs: result.usage.latencyMs,
          estimatedCostUsd: result.usage.estimatedCostUsd,
          success: true
        });
      }
    } catch (error: any) {
      console.error('AI Analysis Failed:', error);
      await this.repository.updateStatus(analysisId, 'FAILED', {
        errorMessage: error.message || 'Unknown error occurred during AI analysis'
      });

      await this.usageService.recordAIUsage({
        userId: resume.userId.toString(),
        feature: 'RESUME_ANALYSIS',
        provider: 'unknown',
        model: 'unknown',
        promptTokens: 0,
        completionTokens: 0,
        totalTokens: 0,
        latencyMs: 0,
        estimatedCostUsd: 0,
        success: false,
        errorMessage: error.message
      });
    }
  }

  public async getLatestAnalysis(userId: string, resumeId: string) {
    // Verify ownership indirectly by passing userId to repository
    const analysis = await this.repository.getLatestByResumeId(resumeId, userId);
    return analysis || null;
  }

  public async getAnalysisHistory(userId: string, resumeId: string) {
    return this.repository.getHistoryByResumeId(resumeId, userId);
  }
}
