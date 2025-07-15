import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth/useAuth';
import { LoginResponse } from '../services/apiService/ApiService';
import { UserData } from '../services/StorageService/StorageService';

/**
 * Interface that defines the authentication context structure
 * Provides access to authentication functions and state throughout the app
 */
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserData | null;
  login: (username: string, password: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  checkAuthState: () => Promise<void>;
}

/**
 * React context for global authentication state
 * Allows any component to access authentication state
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Props for the AuthProvider
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication context provider that wraps the application
 * Provides authentication state and functions to all child components
 * @param children - Child components that will have access to the context
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to access the authentication context
 * @returns Object with authentication state and functions
 * @throws Error if used outside of AuthProvider
 */
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
