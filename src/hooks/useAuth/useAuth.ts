import { useState, useEffect, useCallback } from 'react';
import { authService, AuthState } from '../../services/AuthService/AuthService';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  const checkAuthState = useCallback(async () => {
    try {
      const state = await authService.checkAuthStatus();
      setAuthState(state);
    } catch (error) {
      console.error('Error checking auth state:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
    }
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        setAuthState(prev => ({ ...prev, isLoading: true }));
        const response = await authService.login(username, password);
        await checkAuthState();

        return response;
      } catch (error) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        throw error;
      }
    },
    [checkAuthState],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  return {
    ...authState,
    login,
    logout,
    checkAuthState,
  };
}
