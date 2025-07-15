import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../../config/config';
import { storageService } from '../StorageService/StorageService';
import type { LoginRequest, LoginResponse, ApiResponse } from '../../types/api';

export type { LoginRequest, LoginResponse, ApiResponse };

/**
 * Main service for all API communications
 * Automatically handles:
 * - Authentication via JWT tokens
 * - Headers and timeouts configuration
 * - Centralized error handling
 * - Request and response interceptors
 */
class ApiService {
  private api: AxiosInstance;

  constructor() {
    /**
     * Axios instance configured with:
     * - API base URL
     * - Request timeout
     * - Default headers for JSON
     * - Successful status codes validation
     */
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: REQUEST_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      validateStatus: (status) => status >= 200 && status < 300,
    });

    /**
     * Request interceptor that automatically adds authentication token
     * Executes before each HTTP request to include Bearer token
     * if one exists in local storage
     */
    this.api.interceptors.request.use(
      async (config) => {
        const token = await storageService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    /**
     * Response interceptor that handles errors centrally
     * Provides detailed logging for debugging and consistent error handling
     */
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Log error details for debugging
        console.error('API Error:', {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Performs user login on the server
   * @param credentials - Object with username and password
   * @returns Promise with login response including access_token
   * @throws Error with descriptive message if login fails
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const res = await this.api.post<LoginResponse>('/auth/login', credentials);
      
      // Validate that response has expected format
      if (res.data.code !== 200 || res.data.status !== 'success') {
        throw new Error(res.data.message || 'Login failed');
      }
      
      // Validate that token is present in response
      if (!res.data.data.access_token) {
        throw new Error('Invalid response from server. Missing access token.');
      }
      
      return res.data;
    } catch (error: any) {
      // Enhanced error handling for better debugging
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout. Please check your internet connection and try again.');
      }
      if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        throw new Error('Network error. Please check your internet connection.');
      }
      if (error.response) {
        // Server responded with error status
        const message = error.response.data?.message || error.response.statusText || 'Server error';
        throw new Error(`Server error (${error.response.status}): ${message}`);
      }
      if (error.request) {
        // Request was made but no response received
        throw new Error('No response from server. Please check your internet connection.');
      }
      // Something else happened
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
  
  /**
   * Generic HTTP methods that use the configured Axios instance
   * All automatically include authentication token if available
   */
  
  get<T>(url: string, config?: AxiosRequestConfig) {
    return this.api.get<T>(url, config);
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.api.post<T>(url, data, config);
  }

  put<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.api.put<T>(url, data, config);
  }

  delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.api.delete<T>(url, config);
  }

  request<T>(config: AxiosRequestConfig) {
    return this.api.request<T>(config);
  }
}

/**
 * Singleton instance of the API service
 * Exported for use throughout the application
 */
export const apiService = new ApiService();
 