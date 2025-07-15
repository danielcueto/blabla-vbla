import { apiService } from '../apiService/ApiService';
import type { LoginRequest, LoginResponse } from '../apiService/ApiService';
import { storageService, UserData } from '../StorageService/StorageService';

/**
 * Interface that defines the authentication state of the application
 */
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserData | null;
}

/**
 * Authentication service that handles login, logout operations
 * and authentication state verification. Acts as an intermediate layer
 * between components and storage/API.
 */
class AuthService {
  
  /**
   * Performs user login process
   * @param username - Username or email
   * @param password - User password
   * @returns Promise with login response including token
   * @throws Error if credentials are invalid or connection issues occur
   */
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const loginData: LoginRequest = { username, password };

      // Make login request to server
      const response = await apiService.login(loginData);

      // Save token and user data to persistent storage
      // This allows the user to remain logged in between sessions
      await storageService.saveToken(response.data.access_token);
      await storageService.saveUserData({
        isFirstLogin: response.data.isFirstLogin,
      });

      return response;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Logs out the user by removing all authentication data
   * from local storage
   */
  async logout(): Promise<void> {
    try {
      await storageService.clearAuthData();
    } catch (error) {
      throw new Error('Logout error');
    }
  }

  /**
   * Checks current authentication status by consulting local storage
   * @returns Authentication state with user information
   */
  async checkAuthStatus(): Promise<AuthState> {
    try {
      const isAuthenticated = await storageService.isAuthenticated();
      const user = await storageService.getUserData();

      return {
        isAuthenticated,
        isLoading: false,
        user,
      };
    } catch (error) {
      // Return unauthenticated state on error
      return {
        isAuthenticated: false,
        isLoading: false,
        user: null,
      };
    }
  }

  /**
   * Gets current user data from local storage
   * @returns User data or null if no authenticated user
   */
  async getCurrentUser(): Promise<UserData | null> {
    try {
      return await storageService.getUserData();
    } catch (error) {
      return null;
    }
  }

  /**
   * Checks if a valid token exists in storage
   * @returns true if there's a valid token, false otherwise
   */
  async hasValidToken(): Promise<boolean> {
    try {
      return await storageService.isAuthenticated();
    } catch (error) {
      return false;
    }
  }
}

/**
 * Singleton instance of the authentication service
 * Exported for use throughout the application
 */
export const authService = new AuthService();
