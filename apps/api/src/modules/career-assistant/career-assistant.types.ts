export interface ICareerContextSnapshot {
  targetRole?: string;
  skills?: string[];
  resumeScore?: number;
  resumeWeaknesses?: string[];
  interviewScore?: number;
  totalApplications?: number;
}

export interface IAssistantMessage {
  role: 'USER' | 'ASSISTANT';
  content: string;
  recommendations?: any[];
  nextActions?: string[];
  createdAt: Date;
}
