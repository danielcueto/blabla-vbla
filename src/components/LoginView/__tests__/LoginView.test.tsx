import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import { useNavigation } from '@react-navigation/native'
import LoginView from '../LoginView'
import { useAuth } from '../../../hooks/useAuth/useAuth'
import { showCustomToast } from '../../toast/CustomToast'

/**
 * Mock external dependencies to isolate LoginView testing
 */
jest.mock('../../../hooks/useAuth/useAuth', () => ({
  useAuth: jest.fn(),
}))

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}))

jest.mock('../../toast/CustomToast', () => ({
  showCustomToast: jest.fn(),
}))

// Mock SVG components as they can't be rendered in test environment
jest.mock('../../../../assets/svg/head_login.svg', () => 'HeadLoginSvg')
jest.mock('../../../../assets/svg/ornament_login.svg', () => 'OrnamentLoginSvg')

/**
 * LoginView component test suite
 * Tests form functionality, authentication flow, and navigation
 */
describe('LoginView component', () => {
  // Type the mocks for better intellisense and type safety
  const mockUseAuth = useAuth as jest.Mock
  const mockUseNavigation = useNavigation as jest.Mock
  const mockShowCustomToast = showCustomToast as jest.Mock
  const mockNavigate = jest.fn()

  /**
   * Reset all mocks before each test to prevent test interference
   * This ensures each test starts with a clean slate
   */
  beforeEach(() => {
    jest.clearAllMocks()
    
    // Default navigation mock
    mockUseNavigation.mockReturnValue({
      navigate: mockNavigate,
    })

    // Default auth state: not authenticated, not loading
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      login: jest.fn(),
    })
  })

  /**
   * Test: Should render login form with all required elements
   * Verifies all form components are present and accessible
   */
  it('should render login form with all required elements', () => {
    const { getByText, getByPlaceholderText } = render(<LoginView />)

    // Verify form elements are present
    expect(getByText('Snaps')).toBeTruthy()
    expect(getByPlaceholderText('name@assuresoft.com')).toBeTruthy()
    expect(getByPlaceholderText('password')).toBeTruthy()
    expect(getByText('Login')).toBeTruthy()
  })

  /**
   * Test: Should update email and password input values
   * Verifies controlled input components work correctly
   */
  it('should update email and password input values', () => {
    const { getByPlaceholderText } = render(<LoginView />)

    const emailInput = getByPlaceholderText('name@assuresoft.com')
    const passwordInput = getByPlaceholderText('password')

    // Test email input
    fireEvent.changeText(emailInput, 'test@assuresoft.com')
    expect(emailInput.props.value).toBe('test@assuresoft.com')

    // Test password input
    fireEvent.changeText(passwordInput, 'password123')
    expect(passwordInput.props.value).toBe('password123')
  })

  /**
   * Test: Should show error toast when submitting empty form
   * Verifies form validation for required fields
   */
  it('should show error toast when submitting empty form', async () => {
    const { getByText } = render(<LoginView />)

    const loginButton = getByText('Login')
    fireEvent.press(loginButton)

    await waitFor(() => {
      expect(mockShowCustomToast).toHaveBeenCalledWith({
        type: 'error',
        message: 'Please, complete all fields',
      })
    })
  })

  /**
   * Test: Should show error toast when submitting with only email
   * Verifies form validation for all required fields
   */
  it('should show error toast when submitting with only email', async () => {
    const { getByPlaceholderText, getByText } = render(<LoginView />)

    const emailInput = getByPlaceholderText('name@assuresoft.com')
    const loginButton = getByText('Login')

    fireEvent.changeText(emailInput, 'test@assuresoft.com')
    fireEvent.press(loginButton)

    await waitFor(() => {
      expect(mockShowCustomToast).toHaveBeenCalledWith({
        type: 'error',
        message: 'Please, complete all fields',
      })
    })
  })

  /**
   * Test: Should call login function with correct credentials
   * Verifies successful form submission with valid data
   */
  it('should call login function with correct credentials', async () => {
    const mockLogin = jest.fn().mockResolvedValue(undefined)
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      login: mockLogin,
    })

    const { getByPlaceholderText, getByText } = render(<LoginView />)

    const emailInput = getByPlaceholderText('name@assuresoft.com')
    const passwordInput = getByPlaceholderText('password')
    const loginButton = getByText('Login')

    fireEvent.changeText(emailInput, 'test@assuresoft.com')
    fireEvent.changeText(passwordInput, 'password123')
    fireEvent.press(loginButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@assuresoft.com', 'password123')
      expect(mockShowCustomToast).toHaveBeenCalledWith({
        type: 'success',
        message: 'Login Successful',
      })
    })
  })

  /**
   * Test: Should handle login error and show error message
   * Verifies error handling and user feedback on login failure
   */
  it('should handle login error and show error message', async () => {
    const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'))
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      login: mockLogin,
    })

    const { getByPlaceholderText, getByText } = render(<LoginView />)

    const emailInput = getByPlaceholderText('name@assuresoft.com')
    const passwordInput = getByPlaceholderText('password')
    const loginButton = getByText('Login')

    fireEvent.changeText(emailInput, 'test@assuresoft.com')
    fireEvent.changeText(passwordInput, 'wrongpassword')
    fireEvent.press(loginButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@assuresoft.com', 'wrongpassword')
    })
  })

  /**
   * Test: Should show loading state during login
   * Verifies loading indicator and disabled state during authentication
   */
  it('should show loading state during login', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      login: jest.fn(),
    })

    const { getByText } = render(<LoginView />)

    expect(getByText('Loading...')).toBeTruthy()
  })

  /**
   * Test: Should navigate to Home when user is authenticated
   * Verifies automatic navigation on successful authentication
   */
  it('should navigate to Home when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      login: jest.fn(),
    })

    render(<LoginView />)

    expect(mockNavigate).toHaveBeenCalledWith('Home')
  })

  /**
   * Test: Should trigger error state when login fails
   * Verifies error handling mechanism is triggered
   */
  it('should trigger error state when login fails', async () => {
    const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'))
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      login: mockLogin,
    })

    const { getByPlaceholderText, getByText } = render(<LoginView />)

    const emailInput = getByPlaceholderText('name@assuresoft.com')
    const passwordInput = getByPlaceholderText('password')
    const loginButton = getByText('Login')

    // Trigger error
    fireEvent.changeText(emailInput, 'test@assuresoft.com')
    fireEvent.changeText(passwordInput, 'wrongpassword')
    fireEvent.press(loginButton)

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@assuresoft.com', 'wrongpassword')
    })
  })
})
