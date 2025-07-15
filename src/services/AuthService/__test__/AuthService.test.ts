/**
 * Test suite for AuthService
 * Tests all authentication service functionality including login, logout, 
 * auth status checking, and token validation
 */

import { authService, AuthState } from '../AuthService';
import { apiService, LoginResponse } from '../../apiService/ApiService';
import { storageService, UserData } from '../../StorageService/StorageService';

/**
 * Mock external dependencies to isolate AuthService testing
 * This ensures we test only the AuthService logic without external interference
 */
jest.mock('../../apiService/ApiService');
jest.mock('../../StorageService/StorageService');

// Type the mocks for better intellisense and type safety
const mockedApiService = apiService as jest.Mocked<typeof apiService>;
const mockedStorageService = storageService as jest.Mocked<typeof storageService>;

/**
 * AuthService test suite
 * Tests all public methods and error scenarios
 */
describe('AuthService', () => {
  /**
   * Reset all mocks before each test to prevent test interference
   * This ensures each test starts with a clean slate
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test suite for login functionality
   * Tests successful login and various error scenarios
   */
  describe('login', () => {
    // Test data for login scenarios
    const mockUsername = 'testuser';
    const mockPassword = 'testpass';
    const mockLoginResponse: LoginResponse = {
      code: 200,
      status: 'success',
      message: 'Login successful',
      data: {
        access_token: 'test-access-token',
        isFirstLogin: true,
      },
    };

    /**
     * Test: Should successfully login and save authentication data
     * Verifies the complete login flow including API call and data storage
     */
    it('should login successfully and save data', async () => {
      // Mock successful API response and storage operations
      mockedApiService.login.mockResolvedValue(mockLoginResponse);
      mockedStorageService.saveToken.mockResolvedValue();
      mockedStorageService.saveUserData.mockResolvedValue();

      const result = await authService.login(mockUsername, mockPassword);

      // Verify API was called with correct credentials
      expect(mockedApiService.login).toHaveBeenCalledWith({
        username: mockUsername,
        password: mockPassword,
      });
      
      // Verify token and user data were saved
      expect(mockedStorageService.saveToken).toHaveBeenCalledWith(mockLoginResponse.data.access_token);
      expect(mockedStorageService.saveUserData).toHaveBeenCalledWith({
        isFirstLogin: mockLoginResponse.data.isFirstLogin,
      });
      
      // Verify correct response is returned
      expect(result).toEqual(mockLoginResponse);
    });

    /**
     * Test: Should throw error when API login fails
     * Verifies error handling for failed authentication
     */
    it('should throw error when login fails', async () => {
      const errorMessage = 'Invalid credentials';
      mockedApiService.login.mockRejectedValue(new Error(errorMessage));

      // Expect login to throw the API error
      await expect(authService.login(mockUsername, mockPassword)).rejects.toThrow(errorMessage);

      // Verify API was called but storage methods were not
      expect(mockedApiService.login).toHaveBeenCalledWith({
        username: mockUsername,
        password: mockPassword,
      });
      expect(mockedStorageService.saveToken).not.toHaveBeenCalled();
      expect(mockedStorageService.saveUserData).not.toHaveBeenCalled();
    });

    /**
     * Test: Should throw error when token saving fails
     * Verifies error handling for storage failures during token save
     */
    it('should throw error when saving token fails', async () => {
      // Mock successful login but failed token storage
      mockedApiService.login.mockResolvedValue(mockLoginResponse);
      mockedStorageService.saveToken.mockRejectedValue(new Error('Storage error'));

      await expect(authService.login(mockUsername, mockPassword)).rejects.toThrow('Storage error');

      // Verify login was attempted and token save was attempted
      expect(mockedApiService.login).toHaveBeenCalled();
      expect(mockedStorageService.saveToken).toHaveBeenCalled();
    });

    /**
     * Test: Should throw error when user data saving fails
     * Verifies error handling for storage failures during user data save
     */
    it('should throw error when saving user data fails', async () => {
      // Mock successful login and token save, but failed user data save
      mockedApiService.login.mockResolvedValue(mockLoginResponse);
      mockedStorageService.saveToken.mockResolvedValue();
      mockedStorageService.saveUserData.mockRejectedValue(new Error('User data error'));

      await expect(authService.login(mockUsername, mockPassword)).rejects.toThrow('User data error');

      // Verify all steps were attempted
      expect(mockedApiService.login).toHaveBeenCalled();
      expect(mockedStorageService.saveToken).toHaveBeenCalled();
      expect(mockedStorageService.saveUserData).toHaveBeenCalled();
    });
  });

  /**
   * Test suite for logout functionality
   * Tests successful logout and error scenarios
   */
  describe('logout', () => {
    /**
     * Test: Should successfully logout and clear authentication data
     * Verifies the logout process clears all stored auth data
     */
    it('should logout successfully', async () => {
      mockedStorageService.clearAuthData.mockResolvedValue();

      await authService.logout();

      // Verify auth data is cleared
      expect(mockedStorageService.clearAuthData).toHaveBeenCalled();
    });

    /**
     * Test: Should throw logout error when clearAuthData fails
     * Verifies error handling during logout process
     */
    it('should throw logout error when clearAuthData fails', async () => {
      mockedStorageService.clearAuthData.mockRejectedValue(new Error('Clear data error'));

      await expect(authService.logout()).rejects.toThrow('Logout error');

      expect(mockedStorageService.clearAuthData).toHaveBeenCalled();
    });
  });

  /**
   * Test suite for checkAuthStatus functionality
   * Tests authentication status checking and various scenarios
   */
  describe('checkAuthStatus', () => {
    const mockUserData: UserData = {
      isFirstLogin: false,
    };

    /**
     * Test: Should return authenticated state when user is authenticated
     * Verifies correct state when user has valid authentication
     */
    it('should return authenticated state when user is authenticated', async () => {
      // Mock authenticated user with data
      mockedStorageService.isAuthenticated.mockResolvedValue(true);
      mockedStorageService.getUserData.mockResolvedValue(mockUserData);

      const result = await authService.checkAuthStatus();

      const expectedState: AuthState = {
        isAuthenticated: true,
        isLoading: false,
        user: mockUserData,
      };

      // Verify correct authenticated state is returned
      expect(result).toEqual(expectedState);
      expect(mockedStorageService.isAuthenticated).toHaveBeenCalled();
      expect(mockedStorageService.getUserData).toHaveBeenCalled();
    });

    /**
     * Test: Should return unauthenticated state when user is not authenticated
     * Verifies correct state when user has no valid authentication
     */
    it('should return unauthenticated state when user is not authenticated', async () => {
      // Mock unauthenticated user
      mockedStorageService.isAuthenticated.mockResolvedValue(false);
      mockedStorageService.getUserData.mockResolvedValue(null);

      const result = await authService.checkAuthStatus();

      const expectedState: AuthState = {
        isAuthenticated: false,
        isLoading: false,
        user: null,
      };

      // Verify correct unauthenticated state is returned
      expect(result).toEqual(expectedState);
      expect(mockedStorageService.isAuthenticated).toHaveBeenCalled();
      expect(mockedStorageService.getUserData).toHaveBeenCalled();
    });

    /**
     * Test: Should return unauthenticated state when error occurs
     * Verifies error handling during auth status check
     */
    it('should return unauthenticated state when error occurs', async () => {
      mockedStorageService.isAuthenticated.mockRejectedValue(new Error('Storage error'));

      const result = await authService.checkAuthStatus();

      const expectedState: AuthState = {
        isAuthenticated: false,
        isLoading: false,
        user: null,
      };

      // Verify unauthenticated state is returned on error
      expect(result).toEqual(expectedState);
      expect(mockedStorageService.isAuthenticated).toHaveBeenCalled();
    });
  });

  /**
   * Test suite for getCurrentUser functionality
   * Tests user data retrieval and error scenarios
   */
  describe('getCurrentUser', () => {
    const mockUserData: UserData = {
      isFirstLogin: true,
    };

    /**
     * Test: Should return user data when available
     * Verifies successful user data retrieval
     */
    it('should return user data when available', async () => {
      mockedStorageService.getUserData.mockResolvedValue(mockUserData);

      const result = await authService.getCurrentUser();

      // Verify user data is returned correctly
      expect(result).toEqual(mockUserData);
      expect(mockedStorageService.getUserData).toHaveBeenCalled();
    });

    /**
     * Test: Should return null when no user data available
     * Verifies behavior when no user data exists
     */
    it('should return null when no user data available', async () => {
      mockedStorageService.getUserData.mockResolvedValue(null);

      const result = await authService.getCurrentUser();

      // Verify null is returned when no data exists
      expect(result).toBeNull();
      expect(mockedStorageService.getUserData).toHaveBeenCalled();
    });

    /**
     * Test: Should return null when error occurs
     * Verifies error handling during user data retrieval
     */
    it('should return null when error occurs', async () => {
      mockedStorageService.getUserData.mockRejectedValue(new Error('Storage error'));

      const result = await authService.getCurrentUser();

      // Verify null is returned on error
      expect(result).toBeNull();
    });
  });

  /**
   * Test suite for hasValidToken functionality
   * Tests token validation and error scenarios
   */
  describe('hasValidToken', () => {
    /**
     * Test: Should return true when user has valid token
     * Verifies successful token validation
     */
    it('should return true when user has valid token', async () => {
      mockedStorageService.isAuthenticated.mockResolvedValue(true);

      const result = await authService.hasValidToken();

      // Verify true is returned for valid token
      expect(result).toBe(true);
      expect(mockedStorageService.isAuthenticated).toHaveBeenCalled();
    });

    /**
     * Test: Should return false when user has no valid token
     * Verifies behavior when token is invalid or missing
     */
    it('should return false when user has no valid token', async () => {
      mockedStorageService.isAuthenticated.mockResolvedValue(false);

      const result = await authService.hasValidToken();

      // Verify false is returned for invalid token
      expect(result).toBe(false);
      expect(mockedStorageService.isAuthenticated).toHaveBeenCalled();
    });

    /**
     * Test: Should return false when error occurs
     * Verifies error handling during token validation
     */
    it('should return false when error occurs', async () => {
      mockedStorageService.isAuthenticated.mockRejectedValue(new Error('Storage error'));

      const result = await authService.hasValidToken();

      // Verify false is returned on error
      expect(result).toBe(false);
    });
  });
});
