/**
 * Test suite for ApiService
 * Tests HTTP client functionality, authentication, and API communication
 * 
 * IMPORTANT: Mocks must be placed at the top before any imports
 * This ensures proper Jest module mocking behavior
 */

// Mock external dependencies before imports
jest.mock('axios');
jest.mock('../../../config/config', () => ({
  API_BASE_URL: 'http://test-api.com',
  REQUEST_TIMEOUT_MS: 10000,
}));
jest.mock('../../StorageService/StorageService', () => ({
  storageService: {
    getToken: jest.fn().mockResolvedValue(null),
  },
}));

import axios from 'axios';
import { LoginRequest, LoginResponse } from '../ApiService';

/**
 * Mock axios instance with all necessary methods
 * This isolates API testing from actual HTTP requests
 */
const mockAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  request: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
};

// Ensure axios.create returns our mock instance
(axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);

/**
 * ApiService test suite
 * Tests HTTP client initialization, login functionality, and all HTTP methods
 */
describe('ApiService', () => {
  let apiService: any;

  /**
   * Reset all mocks and reinitialize service before each test
   * This ensures test isolation and clean state
   */
  beforeEach(() => {
    jest.clearAllMocks();

    // Use isolateModules to ensure apiService is imported after mocks are set up
    jest.isolateModules(() => {
      const apiModule = require('../ApiService');
      apiService = apiModule.apiService;
    });
  });

  /**
   * Test suite for constructor and initialization
   * Verifies proper axios instance creation and configuration
   */
  describe('Constructor', () => {
    /**
     * Test: Should create axios instance with correct configuration
     * Verifies base URL, timeout, headers, and validation settings
     */
    it('should create axios instance with correct configuration', () => {
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: 'http://test-api.com',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        validateStatus: expect.any(Function),
      });
    });

    /**
     * Test: Should set up request interceptor for authentication
     * Verifies that authentication interceptor is properly configured
     */
    it('should set up request interceptor for authentication', () => {
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
    });
  });

  /**
   * Test suite for login functionality
   * Tests authentication endpoint and various login scenarios
   */
  describe('login', () => {
    // Test data for login scenarios
    const mockCredentials: LoginRequest = {
      username: 'testuser',
      password: 'testpass',
    };

    const mockLoginResponse: LoginResponse = {
      code: 200,
      status: 'success',
      message: 'Login successful',
      data: {
        access_token: 'test-access-token',
        isFirstLogin: false,
      },
    };

    /**
     * Test: Should login successfully with valid credentials
     * Verifies successful authentication flow and response handling
     */
    it('should login successfully with valid credentials', async () => {
      // Mock successful API response
      mockAxiosInstance.post.mockResolvedValue({
        data: mockLoginResponse,
      });

      const result = await apiService.login(mockCredentials);

      // Verify correct endpoint and credentials were used
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', mockCredentials);
      // Verify correct response is returned
      expect(result).toEqual(mockLoginResponse);
    });

    /**
     * Test: Should throw error when access_token is missing from response
     * Verifies validation of server response structure
     */
    it('should throw error when access_token is missing from response', async () => {
      // Mock response with missing access_token
      mockAxiosInstance.post.mockResolvedValue({
        data: {
          code: 200,
          status: 'success',
          message: 'Login successful',
          data: {
            isFirstLogin: false,
            // Missing access_token field
          },
        },
      });

      // Expect login to throw validation error
      await expect(apiService.login(mockCredentials)).rejects.toThrow(
        'Invalid response from server. Missing access token.'
      );
    });

    /**
     * Test: Should throw error when response code is not 200
     * Verifies error handling for unsuccessful authentication
     */
    it('should throw error when response code is not 200', async () => {
      // Mock error response from server
      mockAxiosInstance.post.mockResolvedValue({
        data: {
          code: 401,
          status: 'error',
          message: 'Invalid credentials',
          data: null,
        },
      });

      // Expect login to throw server error message
      await expect(apiService.login(mockCredentials)).rejects.toThrow(
        'Invalid credentials'
      );
    });

    /**
     * Test: Should throw error when login request fails
     * Verifies error handling for network or request failures
     */
    it('should throw error when login request fails', async () => {
      const errorMessage = 'Invalid credentials';
      mockAxiosInstance.post.mockRejectedValue(new Error(errorMessage));

      // Expect login to throw network error
      await expect(apiService.login(mockCredentials)).rejects.toThrow(errorMessage);
    });
  });

  /**
   * Test suite for HTTP methods
   * Tests all HTTP methods (GET, POST, PUT, DELETE, REQUEST) functionality
   */
  describe('HTTP Methods', () => {
    /**
     * Test: Should call GET method correctly
     * Verifies GET request functionality without additional config
     */
    it('should call get method correctly', async () => {
      const mockResponse = { data: 'test' };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await apiService.get('/test');

      // Verify correct endpoint and parameters
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', undefined);
      // Verify response is returned correctly
      expect(result).toBe(mockResponse);
    });

    /**
     * Test: Should call GET method with config
     * Verifies GET request functionality with additional configuration
     */
    it('should call get method with config', async () => {
      const mockResponse = { data: 'test' };
      const config = { timeout: 5000 };
      mockAxiosInstance.get.mockResolvedValue(mockResponse);

      const result = await apiService.get('/test', config);

      // Verify config is passed correctly
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', config);
      expect(result).toBe(mockResponse);
    });

    /**
     * Test: Should call POST method correctly
     * Verifies POST request functionality with data payload
     */
    it('should call post method correctly', async () => {
      const mockResponse = { data: 'test' };
      const data = { name: 'test' };
      mockAxiosInstance.post.mockResolvedValue(mockResponse);

      const result = await apiService.post('/test', data);

      // Verify correct endpoint, data, and config
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/test', data, undefined);
      expect(result).toBe(mockResponse);
    });

    /**
     * Test: Should call PUT method correctly
     * Verifies PUT request functionality with data payload
     */
    it('should call put method correctly', async () => {
      const mockResponse = { data: 'test' };
      const data = { name: 'test' };
      mockAxiosInstance.put.mockResolvedValue(mockResponse);

      const result = await apiService.put('/test', data);

      // Verify correct endpoint, data, and config
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/test', data, undefined);
      expect(result).toBe(mockResponse);
    });

    /**
     * Test: Should call DELETE method correctly
     * Verifies DELETE request functionality
     */
    it('should call delete method correctly', async () => {
      const mockResponse = { data: 'test' };
      mockAxiosInstance.delete.mockResolvedValue(mockResponse);

      const result = await apiService.delete('/test');

      // Verify correct endpoint and config
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/test', undefined);
      expect(result).toBe(mockResponse);
    });

    /**
     * Test: Should call REQUEST method correctly
     * Verifies generic request functionality with custom config
     */
    it('should call request method correctly', async () => {
      const mockResponse = { data: 'test' };
      const config = { method: 'GET', url: '/test' };
      mockAxiosInstance.request.mockResolvedValue(mockResponse);

      const result = await apiService.request(config);

      // Verify custom config is passed correctly
      expect(mockAxiosInstance.request).toHaveBeenCalledWith(config);
      expect(result).toBe(mockResponse);
    });
  });
});
