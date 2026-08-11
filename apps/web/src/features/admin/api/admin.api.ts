import { apiClient } from '../../../lib/axios';

export const adminApi = {
  getDashboard: async () => {
    const { data } = await apiClient.get('/admin/dashboard');
    return data.data;
  },
  
  getUsers: async (params: any) => {
    const { data } = await apiClient.get('/admin/users', { params });
    return data.data;
  },

  getUserDetails: async (userId: string) => {
    const { data } = await apiClient.get(`/admin/users/${userId}`);
    return data.data;
  },

  updateUserStatus: async (userId: string, status: 'ACTIVE' | 'SUSPENDED') => {
    const { data } = await apiClient.patch(`/admin/users/${userId}/status`, { status });
    return data.data;
  },

  getSubscriptionAnalytics: async () => {
    const { data } = await apiClient.get('/admin/analytics/subscriptions');
    return data.data;
  },

  getRevenueAnalytics: async () => {
    const { data } = await apiClient.get('/admin/analytics/revenue');
    return data.data;
  },

  getAIAnalytics: async () => {
    const { data } = await apiClient.get('/admin/analytics/ai');
    return data.data;
  },

  getPayments: async (params: any) => {
    const { data } = await apiClient.get('/admin/analytics/payments', { params });
    return data.data;
  },

  getSystemHealth: async () => {
    const { data } = await apiClient.get('/admin/system/health');
    return data.data;
  },

  getAuditLogs: async (params: any) => {
    const { data } = await apiClient.get('/admin/audit-logs', { params });
    return data.data;
  }
};
