import { useState, useEffect, useCallback } from 'react';
import { authService, AuthState } from '../../services/AuthService/AuthService';

/**
 * Custom hook that manages all authentication state and logic
 * Provides functions for login, logout and authentication state verification
 * Automatically executes when component mounts to check for active session
 * 
 * @returns Object with:
 * - isAuthenticated: boolean - Whether the user is authenticated
 * - isLoading: boolean - Whether an authentication operation is in progress
 * - user: UserData | null - Current user data
 * - login: function to sign in
 * - logout: function to sign out
 * - checkAuthState: function to verify authentication state
 */
export function useAuth() {
  /**
   * Local state that maintains authentication information
   * Initialized with isLoading: true to show a loading indicator
   * while checking for an active session
   */
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  /**
   * Checks authentication state by consulting local storage
   * Executes when component mounts and when state refresh is needed
   */
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

  /**
   * Function to perform user login
   * @param username - Username or email
   * @param password - User password
   * @returns Promise with server response
   */
  const login = useCallback(
    async (username: string, password: string) => {
      try {
        // Activate loading state during login process
        setAuthState(prev => ({ ...prev, isLoading: true }));
        
        // Perform login through authentication service
        const response = await authService.login(username, password);
        
        // Update state with new authentication information
        await checkAuthState();

        return response;
      } catch (error) {
        // On error, deactivate loading state but maintain error
        setAuthState(prev => ({ ...prev, isLoading: false }));
        throw error;
      }
    },
    [checkAuthState],
  );

  /**
   * Function to log out the user
   * Clears all authentication data from local storage
   */
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

  /**
   * Effect that executes when component mounts
   * Automatically checks if there's an active session (saved token)
   * This allows the user to remain logged in between app restarts
   */
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
