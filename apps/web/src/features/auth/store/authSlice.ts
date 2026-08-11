import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean; // Indicates if we are verifying the session on app load
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitializing: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User }>
    ) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isInitializing = false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitializing = false;
    },
    setAppInitialized: (state) => {
      state.isInitializing = false;
    },
  },
});

export const { setCredentials, logoutUser, setAppInitialized } = authSlice.actions;

export default authSlice.reducer;
