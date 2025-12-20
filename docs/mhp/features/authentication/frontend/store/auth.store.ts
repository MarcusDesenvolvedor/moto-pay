import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse } from '../types/auth.types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthResponse['user'] | null;
  isAuthenticated: boolean;
  setAuth: (authData: AuthResponse) => void;
  clearAuth: () => void;
  setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      setAuth: (authData: AuthResponse) => {
        set({
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken,
          user: authData.user,
          isAuthenticated: true,
        });
      },
      clearAuth: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },
      setToken: (token: string) => {
        set({
          accessToken: token,
          isAuthenticated: !!token,
        });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

