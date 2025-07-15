import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Keys used for persistent storage in AsyncStorage
 */
const TOKEN_KEY = '@auth_token';
const USER_KEY = '@user_data';

/**
 * Interface that defines the structure of user data stored locally
 */
export interface UserData {
  isFirstLogin: boolean;
  // Add more user fields as needed
}

/**
 * Storage service that handles persistence of authentication data
 * using React Native's AsyncStorage. Provides methods to save, retrieve
 * and delete authentication tokens and user data.
 */
class StorageService {

  /**
   * Saves the authentication token to persistent storage
   * @param token - JWT authentication token
   */
  async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      // Silent error - in production you might want to log this
    }
  }

  /**
   * Retrieves the authentication token from persistent storage
   * @returns The saved token or null if it doesn't exist
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      return null;
    }
  }

  /**
   * Removes the authentication token from persistent storage
   */
  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      // Silent error
    }
  }

  /**
   * Saves user data to persistent storage
   * @param userData - User data to save
   */
  async saveUserData(userData: UserData): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (error) {
      // Silent error
    }
  }

  /**
   * Retrieves user data from persistent storage
   * @returns User data or null if it doesn't exist
   */
  async getUserData(): Promise<UserData | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Removes user data from persistent storage
   */
  async removeUserData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      // Silent error
    }
  }

  /**
   * Clears all authentication data (token and user data)
   * Used during logout to ensure no sensitive data remains
   */
  async clearAuthData(): Promise<void> {
    try {
      await Promise.all([this.removeToken(), this.removeUserData()]);
    } catch (error) {
      // Silent error
    }
  }

  /**
   * Checks if the user is authenticated based on token existence
   * @returns true if a valid token exists, false otherwise
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null && token !== '';
  }
}

/**
 * Singleton instance of the storage service
 * Exported for use throughout the application
 */
export const storageService = new StorageService();
