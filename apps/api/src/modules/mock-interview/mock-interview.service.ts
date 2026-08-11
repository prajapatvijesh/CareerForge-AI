import { MockInterviewRepository } from './mock-interview.repository';
import { AppError } from '../../utils/AppError';
import { StartInterviewInput, AnswerSubmissionInput } from './mock-interview.schema';
import { MockQuestionGenerator, MockFeedbackEvaluator } from './ai/mock-provider';
import { GeminiQuestionGenerator, GeminiFeedbackEvaluator } from './ai/gemini-mock-interview.provider';
import { env } from '../../config/env';
import { UsageService } from '../subscription/usage.service';

export class MockInterviewService {
  private repository = new MockInterviewRepository();
  private usageService = new UsageService();
  
  // Provider Factory
  private getProviderConfig(providerKey: string = env.AI_PROVIDER) {
    if (providerKey === 'gemini') {
      return {
        generator: new GeminiQuestionGenerator(),
        evaluator: new GeminiFeedbackEvaluator(),
      };
    }
    // Default to mock
    return {
      generator: new MockQuestionGenerator(),
      evaluator: new MockFeedbackEvaluator(),
    };
  }

  public async startInterview(userId: string, config: StartInterviewInput) {
    const provider = this.getProviderConfig();
    // Generate questions using AI
    try {
      const { questions, usage } = await provider.generator.generateQuestions(
        config.role, 
        config.difficulty, 
        config.company, 
        config.questionCount
      );

      if (usage) {
        await this.usageService.recordAIUsage({
          userId,
          feature: 'MOCK_INTERVIEW',
          provider: usage.provider,
          model: usage.model,
          promptTokens: usage.promptTokens,
          completionTokens: usage.completionTokens,
          totalTokens: usage.totalTokens,
          latencyMs: usage.latencyMs,
          estimatedCostUsd: usage.estimatedCostUsd,
          success: true
        });
      }

      // Save to DB and return to user
      return this.repository.create(userId, config, questions, usage);
    } catch (error: any) {
      // Record failure telemetry
      await this.usageService.recordAIUsage({
        userId,
        feature: 'MOCK_INTERVIEW',
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
      throw error;
    }
  }

  public async submitAnswer(userId: string, interviewId: string, answer: AnswerSubmissionInput) {
    const interview = await this.getInterviewAndCheckOwnership(interviewId, userId);

    if (interview.status === 'COMPLETED' || interview.status === 'ABANDONED') {
      throw new AppError(`Cannot submit answer. Interview is ${interview.status}`, 400);
    }

    this.enforceTimer(interview);

    // Validate that questionId actually exists in the interview
    const questionExists = interview.questions.some(q => q.id === answer.questionId);
    if (!questionExists) {
      throw new AppError('Question ID does not belong to this interview session', 400);
    }

    // Upsert the answer (handles duplicates)
    await this.repository.upsertAnswer(interviewId, userId, answer);
    return { status: 'success' };
  }

  public async finishInterview(userId: string, interviewId: string) {
    const interview = await this.getInterviewAndCheckOwnership(interviewId, userId);

    // Idempotent finish check
    if (interview.status === 'COMPLETED') {
      return interview; // Already finished, return as-is
    }
    
    // Allow retrying if EVALUATION_FAILED, otherwise standard IN_PROGRESS
    if (interview.status !== 'IN_PROGRESS' && interview.status !== 'EVALUATION_FAILED') {
      throw new AppError(`Cannot finish interview with status ${interview.status}`, 400);
    }

    // Fire and forget AI evaluation so we don't block the request if it takes 15 seconds
    this.processEvaluationAsync(interviewId, userId);

    // Return the state which is now processing
    // Since we don't have a specific PROCESSING state for interviews (using IN_PROGRESS), 
    // it will resolve when the client polls or fetches again
    return interview; 
  }

  private async processEvaluationAsync(interviewId: string, userId: string) {
    try {
      const interview = await this.repository.findByIdAndUser(interviewId, userId);
      if (!interview || !interview.answers || interview.answers.length === 0) {
        throw new Error('No answers to evaluate');
      }

      // Map answers to their question text for the AI context
      const qaList = interview.answers.map(ans => {
        const questionText = interview.questions.find(q => q.id === ans.questionId)?.text || 'Unknown Question';
        return { question: questionText, answer: ans.answerText, questionId: ans.questionId, _raw: ans };
      });

      // Send to AI Evaluator
      const provider = this.getProviderConfig();
      const { answersFeedback, overallResult, usage } = await provider.evaluator.evaluateAnswers(qaList);

      // Reconstruct the answers array with the AI scores
      const evaluatedAnswers = qaList.map((qa, idx) => {
        // Feedback can be keyed by questionId or index. Our mock uses index string.
        const fb = answersFeedback[qa.questionId] || answersFeedback[idx.toString()];
        return {
          ...qa._raw,
          feedback: fb?.feedback || '',
          score: fb?.score || 0
        };
      });

      // Persist results
      await this.repository.completeEvaluation(interviewId, userId, overallResult, evaluatedAnswers, usage);

      if (usage) {
        await this.usageService.recordAIUsage({
          userId,
          feature: 'MOCK_INTERVIEW',
          provider: usage.provider,
          model: usage.model,
          promptTokens: usage.promptTokens,
          completionTokens: usage.completionTokens,
          totalTokens: usage.totalTokens,
          latencyMs: usage.latencyMs,
          estimatedCostUsd: usage.estimatedCostUsd,
          success: true
        });
      }

    } catch (error: any) {
      console.error('AI Evaluation Failed:', error);
      // Mark as failed so it can be retried safely without losing answers
      await this.repository.recordEvaluationFailure(interviewId, userId);

      await this.usageService.recordAIUsage({
        userId,
        feature: 'MOCK_INTERVIEW',
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

  public async getHistory(userId: string) {
    return this.repository.getHistory(userId);
  }

  public async getInterview(userId: string, interviewId: string) {
    return this.getInterviewAndCheckOwnership(interviewId, userId);
  }

  // --- Helpers ---

  private async getInterviewAndCheckOwnership(interviewId: string, userId: string) {
    const interview = await this.repository.findByIdAndUser(interviewId, userId);
    if (!interview) {
      throw new AppError('Mock Interview not found or unauthorized', 404);
    }
    return interview;
  }

  private enforceTimer(interview: any) {
    if (!interview.startTime) return;
    
    // Add a 1-minute grace period to account for network latency
    const gracePeriodMinutes = 1;
    const allowedDurationMs = (interview.config.durationMinutes + gracePeriodMinutes) * 60 * 1000;
    const timeElapsedMs = Date.now() - new Date(interview.startTime).getTime();

    if (timeElapsedMs > allowedDurationMs) {
      throw new AppError('Time has expired for this interview session', 403);
    }
  }
}
