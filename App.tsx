import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './docs/mhp/features/authentication/frontend/store/auth.store';
import { AuthNavigator } from './navigation/AuthNavigator';
import { AppNavigator } from './navigation/AppNavigator';
import { Loading } from './shared/components/Loading';
import { getToken } from './shared/storage/token-storage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setToken = useAuthStore((state) => state.setToken);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = await getToken();
        if (token) {
          setToken(token);
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
      } finally {
        setIsReady(true);
      }
    };

    initializeAuth();
  }, [setToken]);

  if (!isReady) {
    return <Loading />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </QueryClientProvider>
  );
}

