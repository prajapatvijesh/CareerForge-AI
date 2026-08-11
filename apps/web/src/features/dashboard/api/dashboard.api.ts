import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';

// Typing the expected highly-structured composite response
export interface DashboardSummary {
  profile: {
    completionPercentage: number;
    isOnboarding: boolean;
  };
  resumes: {
    totalCount: number;
    recent: any[]; // Using any for MVP; should be IResume
  };
  jobs: {
    activeApplications: number;
    status: string;
  };
  quickActions: {
    id: string;
    label: string;
    link: string;
    icon: string;
    disabled?: boolean;
  }[];
  notifications: {
    unreadCount: number;
    items: any[];
  };
  recommendations: {
    id: string;
    type: 'INFO' | 'WARNING' | 'SUCCESS';
    title: string;
    description: string;
    actionLink: string;
    actionText: string;
  }[];
}

export const useGetDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async (): Promise<DashboardSummary> => {
      const response = await apiClient.get('/dashboard/summary');
      return response.data.data;
    },
    // Aggressive caching for the "Command Center" feel
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
};
