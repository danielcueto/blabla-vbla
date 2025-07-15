/**
 * Test suite for StorageService
 * Tests local storage functionality for authentication tokens and user data
 * Uses AsyncStorage for React Native persistent storage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageService, UserData } from '../StorageService';

/**
 * Mock AsyncStorage to isolate storage testing
 * This prevents actual device storage operations during testing
 */
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

/**
 * StorageService test suite
 * Tests all storage operations including token management, user data, and authentication
 */
describe('StorageService', () => {
  // Type the mock for better intellisense and type safety
  const mockedAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

  /**
   * Reset all mocks before each test to prevent test interference
   * This ensures each test starts with a clean slate
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test suite for token management functionality
   * Tests saving, retrieving, and removing authentication tokens
   */
  describe('Token Management', () => {
    /**
     * Test: Should save token successfully
     * Verifies token storage functionality
     */
    it('should save token successfully', async () => {
      mockedAsyncStorage.setItem.mockResolvedValue();

      await storageService.saveToken('test-token');

      // Verify token is saved with correct key and value
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith('@auth_token', 'test-token');
    });

    /**
     * Test: Should handle save token error gracefully
     * Verifies error handling during token save operations
     */
    it('should handle save token error gracefully', async () => {
      mockedAsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));

      // Should not throw an error, but handle gracefully
      await expect(storageService.saveToken('test-token')).resolves.toBeUndefined();
    });

    /**
     * Test: Should get token successfully
     * Verifies token retrieval functionality
     */
    it('should get token successfully', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue('test-token');

      const token = await storageService.getToken();

      // Verify correct token is returned
      expect(token).toBe('test-token');
      expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith('@auth_token');
    });

    /**
     * Test: Should return null when getting token fails
     * Verifies error handling during token retrieval
     */
    it('should return null when getting token fails', async () => {
      mockedAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const token = await storageService.getToken();

      // Should return null on error instead of throwing
      expect(token).toBeNull();
    });

    /**
     * Test: Should remove token successfully
     * Verifies token removal functionality
     */
    it('should remove token successfully', async () => {
      mockedAsyncStorage.removeItem.mockResolvedValue();

      await storageService.removeToken();

      // Verify token is removed with correct key
      expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith('@auth_token');
    });

    /**
     * Test: Should handle remove token error gracefully
     * Verifies error handling during token removal
     */
    it('should handle remove token error gracefully', async () => {
      mockedAsyncStorage.removeItem.mockRejectedValue(new Error('Storage error'));

      // Should not throw an error, but handle gracefully
      await expect(storageService.removeToken()).resolves.toBeUndefined();
    });
  });

  /**
   * Test suite for user data management functionality
   * Tests saving, retrieving, and removing user data
   */
  describe('User Data Management', () => {
    // Test data for user scenarios
    const testUserData: UserData = {
      isFirstLogin: true,
    };

    /**
     * Test: Should save user data successfully
     * Verifies user data storage with JSON serialization
     */
    it('should save user data successfully', async () => {
      mockedAsyncStorage.setItem.mockResolvedValue();

      await storageService.saveUserData(testUserData);

      // Verify user data is saved as JSON string
      expect(mockedAsyncStorage.setItem).toHaveBeenCalledWith(
        '@user_data',
        JSON.stringify(testUserData)
      );
    });

    /**
     * Test: Should handle save user data error gracefully
     * Verifies error handling during user data save operations
     */
    it('should handle save user data error gracefully', async () => {
      mockedAsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));

      // Should not throw an error, but handle gracefully
      await expect(storageService.saveUserData(testUserData)).resolves.toBeUndefined();
    });

    /**
     * Test: Should get user data successfully
     * Verifies user data retrieval with JSON deserialization
     */
    it('should get user data successfully', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(JSON.stringify(testUserData));

      const userData = await storageService.getUserData();

      // Verify correct user data is returned
      expect(userData).toEqual(testUserData);
      expect(mockedAsyncStorage.getItem).toHaveBeenCalledWith('@user_data');
    });

    /**
     * Test: Should return null when user data is not found
     * Verifies behavior when no user data exists
     */
    it('should return null when user data is not found', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(null);

      const userData = await storageService.getUserData();

      // Should return null when no data exists
      expect(userData).toBeNull();
    });

    /**
     * Test: Should return null when getting user data fails
     * Verifies error handling during user data retrieval
     */
    it('should return null when getting user data fails', async () => {
      mockedAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const userData = await storageService.getUserData();

      // Should return null on error instead of throwing
      expect(userData).toBeNull();
    });

    /**
     * Test: Should remove user data successfully
     * Verifies user data removal functionality
     */
    it('should remove user data successfully', async () => {
      mockedAsyncStorage.removeItem.mockResolvedValue();

      await storageService.removeUserData();

      // Verify user data is removed with correct key
      expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith('@user_data');
    });

    /**
     * Test: Should handle remove user data error gracefully
     * Verifies error handling during user data removal
     */
    it('should handle remove user data error gracefully', async () => {
      mockedAsyncStorage.removeItem.mockRejectedValue(new Error('Storage error'));

      // Should not throw an error, but handle gracefully
      await expect(storageService.removeUserData()).resolves.toBeUndefined();
    });
  });

  /**
   * Test suite for authentication management functionality
   * Tests combined authentication operations and status checking
   */
  describe('Authentication Management', () => {
    /**
     * Test: Should clear all auth data successfully
     * Verifies complete authentication data cleanup
     */
    it('should clear all auth data successfully', async () => {
      mockedAsyncStorage.removeItem.mockResolvedValue();

      await storageService.clearAuthData();

      // Verify both token and user data are removed
      expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith('@auth_token');
      expect(mockedAsyncStorage.removeItem).toHaveBeenCalledWith('@user_data');
      expect(mockedAsyncStorage.removeItem).toHaveBeenCalledTimes(2);
    });

    /**
     * Test: Should handle clear auth data error gracefully
     * Verifies error handling during complete auth data cleanup
     */
    it('should handle clear auth data error gracefully', async () => {
      mockedAsyncStorage.removeItem.mockRejectedValue(new Error('Storage error'));

      // Should not throw an error, but handle gracefully
      await expect(storageService.clearAuthData()).resolves.toBeUndefined();
    });

    /**
     * Test: Should return true when user is authenticated (has token)
     * Verifies authentication status check with valid token
     */
    it('should return true when user is authenticated (has token)', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue('valid-token');

      const isAuthenticated = await storageService.isAuthenticated();

      // Should return true when valid token exists
      expect(isAuthenticated).toBe(true);
    });

    /**
     * Test: Should return false when user is not authenticated (no token)
     * Verifies authentication status check with no token
     */
    it('should return false when user is not authenticated (no token)', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue(null);

      const isAuthenticated = await storageService.isAuthenticated();

      // Should return false when no token exists
      expect(isAuthenticated).toBe(false);
    });

    /**
     * Test: Should return false when user is not authenticated (empty token)
     * Verifies authentication status check with empty token
     */
    it('should return false when user is not authenticated (empty token)', async () => {
      mockedAsyncStorage.getItem.mockResolvedValue('');

      const isAuthenticated = await storageService.isAuthenticated();

      // Should return false when token is empty
      expect(isAuthenticated).toBe(false);
    });

    /**
     * Test: Should return false when getting token fails
     * Verifies error handling during authentication status check
     */
    it('should return false when getting token fails', async () => {
      mockedAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const isAuthenticated = await storageService.isAuthenticated();

      // Should return false on error instead of throwing
      expect(isAuthenticated).toBe(false);
    });
  });
});
