import { CareerAssistantRepository } from './career-assistant.repository';
import { GeminiCareerAssistantProvider } from './ai/gemini-career-assistant.provider';
import { UsageService } from '../subscription/usage.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { PLAN_CONFIG } from '../subscription/plan.config';
import { AppError } from '../../utils/AppError';
import { ICareerContextSnapshot, IAssistantMessage } from './career-assistant.types';

export class CareerAssistantService {
  private repository = new CareerAssistantRepository();
  private aiProvider = new GeminiCareerAssistantProvider();
  private usageService = new UsageService();
  private subscriptionService = new SubscriptionService();

  async chat(userId: string, message: string, conversationId?: string) {
    if (!message || message.trim().length === 0) {
      throw new AppError('Message cannot be empty', 400);
    }
    if (message.length > 1000) {
      throw new AppError('Message is too long. Please limit to 1000 characters.', 400);
    }

    // 1. Subscription Limit Enforcement
    const subscription = await this.subscriptionService.getCurrentSubscription(userId);
    const limit = PLAN_CONFIG[subscription.plan].aiRequestsPerMonth;
    
    // We use 'OTHER_AI' as the feature type, matching AIFeatureType in usage.model.ts
    const reserved = await this.usageService.checkAndReserveLimit(
      userId,
      'OTHER_AI',
      limit,
      subscription.currentPeriodStart,
      subscription.currentPeriodEnd
    );

    if (!reserved) {
      throw new AppError('AI usage limit reached. Please upgrade to PRO.', 429);
    }

    const startTime = Date.now();
    let isSuccess = false;
    let tokens = { prompt: 0, completion: 0, total: 0 };
    let errorMessage = '';
    
    try {
      let conversation = null;
      let history: IAssistantMessage[] = [];
      let contextSnapshot: ICareerContextSnapshot | undefined;

      if (conversationId) {
        conversation = await this.repository.getConversationById(conversationId, userId);
        if (!conversation) throw new AppError('Conversation not found', 404);
        
        // Use existing context if available, otherwise aggregate
        contextSnapshot = conversation.contextSnapshot;
        // Limit history to last 10 messages to prevent excessive token usage
        history = conversation.messages.slice(-10);
      }

      if (!contextSnapshot) {
        contextSnapshot = await this.buildCareerContext(userId);
      }

      const userMsg: IAssistantMessage = {
        role: 'USER',
        content: message.trim(),
        createdAt: new Date()
      };
      
      history.push(userMsg);

      // 2. Call Gemini API
      const aiResult = await this.aiProvider.generateCareerResponse(contextSnapshot, message.trim(), history);
      isSuccess = true;
      tokens = aiResult.tokens;

      const aiMsg: IAssistantMessage = {
        role: 'ASSISTANT',
        content: aiResult.answer,
        recommendations: aiResult.recommendations,
        nextActions: aiResult.nextActions,
        createdAt: new Date()
      };

      // 3. Persist Conversation
      if (conversationId) {
        await this.repository.appendMessage(conversationId, userMsg);
        await this.repository.appendMessage(conversationId, aiMsg);
      } else {
        const newConv = await this.repository.createConversation(userId, userMsg, contextSnapshot!);
        conversationId = newConv._id.toString();
        await this.repository.appendMessage(conversationId, aiMsg);
      }

      return {
        conversationId,
        answer: aiResult.answer,
        recommendations: aiResult.recommendations,
        nextActions: aiResult.nextActions
      };

    } catch (error: any) {
      errorMessage = error.message;
      throw error;
    } finally {
      // 4. Record Usage Telemetry
      const latencyMs = Date.now() - startTime;
      
      // Rough estimation of cost for gemini-1.5-flash ($0.075 / 1M input, $0.3 / 1M output)
      const costUsd = (tokens.prompt / 1000000) * 0.075 + (tokens.completion / 1000000) * 0.3;

      await this.usageService.recordAIUsage({
        userId,
        feature: 'OTHER_AI',
        provider: 'gemini',
        model: 'gemini-1.5-flash',
        promptTokens: tokens.prompt,
        completionTokens: tokens.completion,
        totalTokens: tokens.total,
        estimatedCostUsd: Number(costUsd.toFixed(6)),
        latencyMs,
        success: isSuccess,
        errorMessage: isSuccess ? undefined : errorMessage
      });
    }
  }

  async getConversations(userId: string, query: any) {
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const conversations = await this.repository.getConversationsByUserId(userId, skip, limit);
    const total = await this.repository.countConversationsByUserId(userId);

    return {
      conversations,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getConversationDetails(conversationId: string, userId: string) {
    const conversation = await this.repository.getConversationById(conversationId, userId);
    if (!conversation) throw new AppError('Conversation not found', 404);
    return conversation;
  }

  async deleteConversation(conversationId: string, userId: string) {
    const conversation = await this.repository.deleteConversation(conversationId, userId);
    if (!conversation) throw new AppError('Conversation not found', 404);
    return { success: true };
  }

  private async buildCareerContext(userId: string): Promise<ICareerContextSnapshot> {
    const [profile, analysis, jobStats, interview] = await Promise.all([
      this.repository.getUserProfile(userId),
      this.repository.getLatestResumeAnalysis(userId),
      this.repository.getJobStats(userId),
      this.repository.getLatestInterviewScore(userId)
    ]);

    return {
      targetRole: profile?.headline,
      skills: profile?.skills?.map((s: any) => s.name) || [],
      resumeScore: analysis?.atsScore,
      resumeWeaknesses: analysis?.weaknesses || [],
      interviewScore: interview?.overallResult?.totalScore,
      totalApplications: jobStats.total
    };
  }
}
