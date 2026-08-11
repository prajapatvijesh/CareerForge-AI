import { IQuestionGenerator, IFeedbackEvaluator, IQuestion, IOverallResult, IAIUsageMetrics } from './ai-provider.interface';
import crypto from 'crypto';

const MOCK_USAGE: IAIUsageMetrics = {
  provider: 'mock-gemini',
  model: 'gemini-1.5-flash-mock',
  promptTokens: 150,
  completionTokens: 300,
  totalTokens: 450,
  latencyMs: 1200,
  estimatedCostUsd: 0.0001
};

export class MockQuestionGenerator implements IQuestionGenerator {
  public async generateQuestions(role: string, difficulty: string, company?: string, count: number = 5): Promise<{ questions: IQuestion[], usage: IAIUsageMetrics }> {
    // Simulate API delay
    await new Promise(res => setTimeout(res, 1000));
    
    const questions: IQuestion[] = Array.from({ length: count }).map((_, i) => ({
      id: crypto.randomUUID(),
      text: i % 2 === 0 
        ? `Can you explain a challenging technical problem you solved as a ${role}${company ? ` at a company like ${company}` : ''}?`
        : `How do you handle conflicts within your engineering team when working on difficult (${difficulty.toLowerCase()}) tasks?`,
      type: i % 2 === 0 ? 'TECHNICAL' : 'BEHAVIORAL'
    }));

    return { questions, usage: MOCK_USAGE };
  }
}

export class MockFeedbackEvaluator implements IFeedbackEvaluator {
  public async evaluateAnswers(qaList: { question: string; answer: string }[]) {
    await new Promise(res => setTimeout(res, 2000));

    const answersFeedback: Record<string, any> = {};
    let totalScore = 0;

    qaList.forEach((qa, idx) => {
      const score = Math.floor(Math.random() * 4) + 6; // 6-10
      totalScore += score;
      answersFeedback[idx.toString()] = {
        score,
        feedback: qa.answer.length > 20 ? 'Good answer with sufficient detail.' : 'Answer is too brief. Try to use the STAR method to provide more context.'
      };
    });

    const normalizedTotal = Math.round((totalScore / (qaList.length * 10)) * 100) || 0;

    const overallResult: IOverallResult = {
      totalScore: normalizedTotal,
      strengths: ['Communicates clearly', 'Maintains composure'],
      weaknesses: ['Could dive deeper into technical specifics', 'Lacks measurable outcomes in behavioral answers'],
      suggestions: ['Use the STAR method more strictly', 'Mention specific metrics when discussing past work']
    };

    return {
      answersFeedback,
      overallResult,
      usage: MOCK_USAGE
    };
  }
}
