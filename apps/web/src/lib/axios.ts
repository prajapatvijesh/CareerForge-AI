import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Axios Interceptor for Refresh Token Rotation
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh' && originalRequest.url !== '/auth/login') {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token. 
        // The cookie will be automatically sent and set by the server.
        await apiClient.post('/auth/refresh');
        
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, the user needs to log in again.
        // We could dispatch a logout action here if we had access to the store,
        // but typically the UI (React Query / ProtectedRoute) will handle the 401
        // and redirect to login.
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
