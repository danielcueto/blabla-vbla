import { apiService, LoginRequest, LoginResponse } from '../apiService/ApiService';
import { storageService, UserData } from '../StorageService/StorageService';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserData | null;
}

class AuthService {
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const loginData: LoginRequest = { username, password };

      const response = await apiService.login(loginData);

      await storageService.saveToken(response.access_token);
      await storageService.saveUserData({
        isFirstLogin: response.isFirstLogin,
      });

      return response;
    } catch (error: any) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await storageService.clearAuthData();
    } catch (error) {
      throw new Error('Logout error');
    }
  }

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
      // Retornar estado no autenticado en caso de error
      return {
        isAuthenticated: false,
        isLoading: false,
        user: null,
      };
    }
  }

  async getCurrentUser(): Promise<UserData | null> {
    try {
      return await storageService.getUserData();
    } catch (error) {
      return null;
    }
  }

  async hasValidToken(): Promise<boolean> {
    try {
      return await storageService.isAuthenticated();
    } catch (error) {
      return false;
    }
  }
}

export const authService = new AuthService();
