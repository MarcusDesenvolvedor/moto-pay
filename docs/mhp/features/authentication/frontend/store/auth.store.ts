import { create } from 'zustand';
import { AuthResponse } from '../types/auth.types';
import { saveTokens, clearTokens, getToken, getRefreshToken } from '../../../../../../shared/storage/token-storage';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthResponse['user'] | null;
  isAuthenticated: boolean;
  setAuth: (authData: AuthResponse) => Promise<void>;
  clearAuth: () => Promise<void>;
  setToken: (token: string) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  
  setAuth: async (authData: AuthResponse) => {
    // Save tokens to secure storage
    await saveTokens(authData.accessToken, authData.refreshToken);
    
    set({
      accessToken: authData.accessToken,
      refreshToken: authData.refreshToken,
      user: authData.user,
      isAuthenticated: true,
    });
  },
  
  clearAuth: async () => {
    // Clear tokens from secure storage
    await clearTokens();
    
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
    });
  },
  
  setToken: async (token: string) => {
    // Update access token in secure storage
    const { saveAccessToken } = await import('../../../../../../shared/storage/token-storage');
    await saveAccessToken(token);
    
    set({
      accessToken: token,
      isAuthenticated: !!token,
    });
  },
  
  initialize: async () => {
    // Load tokens from secure storage on app start
    const accessToken = await getToken();
    const refreshToken = await getRefreshToken();
    
    if (accessToken && refreshToken) {
      set({
        accessToken,
        refreshToken,
        isAuthenticated: true,
      });
    }
  },
}));

