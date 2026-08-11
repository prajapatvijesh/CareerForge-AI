export interface IAnalysisResult {
  atsScore: number;
  keywords: {
    present: string[];
    missing: string[];
  };
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  usage?: {
    provider: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    latencyMs: number;
    estimatedCostUsd: number;
  };
}

export interface IAIProvider {
  /**
   * Analyzes a resume against an optional job description.
   * @param resumeText The extracted text content of the resume
   * @param jobDescription Optional job description for targeted ATS scoring
   */
  analyzeResume(resumeText: string, jobDescription?: string): Promise<IAnalysisResult>;
  
  /**
   * Future implementation for Server-Sent Events (SSE)
   */
  analyzeResumeStream?(resumeText: string, jobDescription?: string): AsyncGenerator<Partial<IAnalysisResult>>;
}
