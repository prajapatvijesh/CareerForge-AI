import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
// Shared types in a real app, defining here for simplicity

export const useGetResumes = () => {
  return useQuery({
    queryKey: ['resumes'],
    queryFn: async () => {
      const response = await apiClient.get('/resumes');
      return response.data.data.resumes;
    },
  });
};

export const useGetResume = (id: string) => {
  return useQuery({
    queryKey: ['resumes', id],
    queryFn: async () => {
      const response = await apiClient.get(`/resumes/${id}`);
      return response.data.data.resume;
    },
    enabled: !!id,
  });
};

export const useCreateResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; templateId?: string; useProfileData?: boolean }) => {
      const response = await apiClient.post('/resumes', data);
      return response.data.data.resume;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
};

// Used for autosave with debounce
export const useUpdateResume = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Record<string, any>>) => {
      const response = await apiClient.patch(`/resumes/${id}`, data);
      return response.data.data.resume;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['resumes', id], data);
    },
  });
};

export const useDuplicateResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/resumes/${id}/duplicate`);
      return response.data.data.resume;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/resumes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
  });
};

export const useExportPdf = () => {
  return useMutation({
    mutationFn: async ({ id, htmlContent }: { id: string; htmlContent: string }) => {
      const response = await apiClient.post(`/resumes/${id}/export/pdf`, { htmlContent }, {
        responseType: 'blob', // Important for downloading files
      });
      
      // Create a download link for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    },
  });
};
