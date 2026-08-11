import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import { z } from 'zod';
import { useAppDispatch } from '@/store/hooks';
import { logoutUser } from '../store/authSlice';

// We reuse schemas from backend conceptually, but for frontend we can redefine or import them.
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginData = z.infer<typeof loginSchema>;
type SignupData = z.infer<typeof signupSchema>;

export const useLogin = () => {
  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiClient.post('/auth/login', data);
      return response.data;
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: async (data: SignupData) => {
      const response = await apiClient.post('/auth/register', data);
      return response.data;
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSettled: () => {
      queryClient.clear(); // Clear all cached queries
      dispatch(logoutUser());
    },
  });
};

export const useGetMe = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await apiClient.get('/auth/me');
      return response.data.data.user;
    },
    retry: (failureCount, error: any) => {
      if (error.response?.status === 401) return false;
      return failureCount < 3;
    },
  });
};
