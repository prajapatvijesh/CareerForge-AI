export type PlanType = 'FREE' | 'PRO';

export interface IPlanLimits {
  maxResumes: number;
  maxJobApplications: number;
  resumeAnalysisPerMonth: number;
  mockInterviewsPerMonth: number;
  aiRequestsPerMonth: number;
}

export const PLAN_CONFIG: Record<PlanType, IPlanLimits> = {
  FREE: {
    maxResumes: 3,
    maxJobApplications: 50,
    resumeAnalysisPerMonth: 5,
    mockInterviewsPerMonth: 3,
    aiRequestsPerMonth: 10,
  },
  PRO: {
    maxResumes: 20,
    maxJobApplications: 500,
    resumeAnalysisPerMonth: 50,
    mockInterviewsPerMonth: 25,
    aiRequestsPerMonth: 100,
  }
};
