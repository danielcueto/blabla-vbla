import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAuth } from '../useAuth';
import { authService } from '../../../services/AuthService/AuthService';

/**
 * Mock the AuthService module to isolate the hook testing
 * This ensures we test only the hook logic, not the service implementation
 */
jest.mock('../../../services/AuthService/AuthService', () => {
  return {
    authService: {
      checkAuthStatus: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      getCurrentUser: jest.fn(),
      hasValidToken: jest.fn(),
    },
  };
});

/**
 * Test suite for the useAuth custom hook
 * Tests all authentication state management functionality
 */
describe('useAuth', () => {
  // Type the mock for better intellisense and type safety
  const mockedAuthService = authService as jest.Mocked<typeof authService>;

  /**
   * Reset all mocks before each test to prevent test interference
   * This ensures each test starts with a clean slate
   */
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test: Hook should initialize in loading state and then resolve
   * Verifies the initial loading behavior and state transition
   */
  it('should initialize in loading state and then resolve', async () => {
    // Mock the initial auth status check to return unauthenticated state
    mockedAuthService.checkAuthStatus.mockResolvedValueOnce({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });

    const { result } = renderHook(() => useAuth());

    // 1. Hook should start with isLoading = true
    expect(result.current.isLoading).toBe(true);

    // 2. Wait for the initial check to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 3. Verify the final state after loading
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  /**
   * Test: Should successfully login and update state
   * Verifies the complete login flow and state updates
   */
  it('should successfully login and update state', async () => {
    // Mock initial state before login (unauthenticated)
    mockedAuthService.checkAuthStatus.mockResolvedValueOnce({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
    
    // Mock successful login response with token and user data
    mockedAuthService.login.mockResolvedValueOnce({
      code: 200,
      status: 'success',
      message: 'Login successful',
      data: {
        access_token: 'fake-token',
        isFirstLogin: true,
      },
    });

    // After login, checkAuthStatus should find an authenticated user
    mockedAuthService.checkAuthStatus.mockResolvedValueOnce({
      isAuthenticated: true,
      isLoading: false,
      user: { isFirstLogin: true },
    });

    const { result } = renderHook(() => useAuth());

    // Wait for initial loading to complete
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Execute login action within act() since it updates state
    await act(async () => {
      await result.current.login('user', 'pass');
    });

    // Verify state has been updated correctly
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({ isFirstLogin: true });
    expect(result.current.isLoading).toBe(false);
  });

  /**
   * Test: Should logout and clear state
   * Verifies the logout flow and state cleanup
   */
  it('should logout and clear state', async () => {
    // Mock initial authenticated state
    mockedAuthService.checkAuthStatus.mockResolvedValueOnce({
      isAuthenticated: true,
      isLoading: false,
      user: { isFirstLogin: false },
    });

    // Mock successful logout
    mockedAuthService.logout.mockResolvedValue();
    const { result } = renderHook(() => useAuth());

    // Wait for authenticated state to load
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    // Execute logout
    await act(async () => {
      await result.current.logout();
    });

    // Verify state has been cleared
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  /**
   * Test: Should handle login error and maintain previous state
   * Verifies error handling during failed login attempts
   */
  it('should handle login error and maintain previous state', async () => {
    // Mock initial unauthenticated state
    mockedAuthService.checkAuthStatus.mockResolvedValueOnce({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });

    // Mock failed login with error
    mockedAuthService.login.mockRejectedValueOnce(
      new Error('Invalid credentials'),
    );

    const { result } = renderHook(() => useAuth());

    // Wait for initial loading to complete
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Expect login function to throw an exception
    await act(async () => {
      await expect(result.current.login('wrong', 'creds')).rejects.toThrow(
        'Invalid credentials',
      );
    });

    // Verify state has NOT changed after failed login
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });
});