import { apiClient as api } from '../../../lib/axios';

export interface Recommendation {
  title: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'SKILL' | 'RESUME' | 'JOB' | 'INTERVIEW' | 'LEARNING';
}

export interface AssistantMessage {
  role: 'USER' | 'ASSISTANT';
  content: string;
  recommendations?: Recommendation[];
  nextActions?: string[];
  createdAt: string;
}

export interface CareerAssistantConversation {
  _id: string;
  userId: string;
  title?: string;
  messages: AssistantMessage[];
  contextSnapshot?: any;
  createdAt: string;
  updatedAt: string;
}

export const careerAssistantApi = {
  chat: async (data: { message: string; conversationId?: string }) => {
    const response = await api.post('/career-assistant/chat', data);
    return response.data;
  },
  
  getConversations: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get('/career-assistant/conversations', { params });
    return response.data;
  },
  
  getConversationDetails: async (id: string): Promise<CareerAssistantConversation> => {
    const response = await api.get(`/career-assistant/conversations/${id}`);
    return response.data;
  },
  
  deleteConversation: async (id: string) => {
    const response = await api.delete(`/career-assistant/conversations/${id}`);
    return response.data;
  }
};
