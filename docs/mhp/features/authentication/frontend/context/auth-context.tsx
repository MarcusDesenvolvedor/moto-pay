import React, { createContext, useContext, useEffect, useState } from 'react';
import { getToken } from '../../../shared/storage/token-storage';
import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { UserResponse } from '../types/auth.types';

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  const { data: user, isLoading: isLoadingUser, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async (): Promise<UserResponse> => {
      const response = await authApi.getCurrentUser();
      return response.data;
    },
    retry: false,
    enabled: hasToken === true,
  });

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const token = await getToken();
    setHasToken(!!token);
  };

  const isLoading = hasToken === null || (hasToken && isLoadingUser);
  const isAuthenticated = !!user && hasToken === true && !error;

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

