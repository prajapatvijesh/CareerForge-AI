export interface IQuestion {
  id: string;
  text: string;
  type: 'TECHNICAL' | 'BEHAVIORAL';
}

export interface IAnswerFeedback {
  score: number; // 0-10
  feedback: string;
}

export interface IOverallResult {
  totalScore: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface IAIUsageMetrics {
  provider: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  estimatedCostUsd: number;
}

export interface IQuestionGenerator {
  generateQuestions(role: string, difficulty: string, company?: string, count?: number): Promise<{ questions: IQuestion[], usage: IAIUsageMetrics }>;
}

export interface IFeedbackEvaluator {
  evaluateAnswers(questionsAndAnswers: { question: string; answer: string }[]): Promise<{
    answersFeedback: Record<string, IAnswerFeedback>; // keyed by questionId (passed out of band or array index stringified)
    overallResult: IOverallResult;
    usage: IAIUsageMetrics;
  }>;
}
