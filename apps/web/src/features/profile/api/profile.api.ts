import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';

// Interfaces mapping to backend schema
export interface ISkill { name: string; proficiency: 'Beginner' | 'Intermediate' | 'Expert'; }
export interface IEducation { school: string; degree: string; fieldOfStudy: string; startDate: string; endDate?: string; current: boolean; description?: string; }
export interface IExperience { company: string; position: string; location?: string; startDate: string; endDate?: string; current: boolean; description?: string; }
export interface IProject { title: string; description: string; url?: string; technologies: string[]; startDate?: string; endDate?: string; }
export interface IAchievement { title: string; description?: string; date?: string; issuer?: string; }
export interface ISocialLinks { linkedin?: string; github?: string; twitter?: string; portfolio?: string; other?: string; }

export interface IProfile {
  avatarUrl?: string;
  headline?: string;
  bio?: string;
  location?: string;
  skills: ISkill[];
  education: IEducation[];
  experience: IExperience[];
  projects: IProject[];
  achievements: IAchievement[];
  socialLinks: ISocialLinks;
  completionPercentage: number;
}

export const useGetProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await apiClient.get('/profile');
      return response.data.data.profile as IProfile;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<IProfile>) => {
      const response = await apiClient.put('/profile', data);
      return response.data.data.profile as IProfile;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await apiClient.post('/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data.profile as IProfile;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['profile'], data);
    },
  });
};
