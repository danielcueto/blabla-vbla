import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAuth } from '../useAuth';
import { authService } from '../../../services/AuthService/AuthService';

// El mock de Jest para el servicio es idéntico y no necesita cambios.
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

describe('useAuth', () => {
  // Tipamos el mock para tener autocompletado y seguridad de tipos.
  const mockedAuthService = authService as jest.Mocked<typeof authService>;

  beforeEach(() => {
    // Limpiamos los mocks antes de cada test para evitar interferencias.
    jest.clearAllMocks();
  });

  it('debería inicializar en estado de carga (loading) y luego resolver', async () => {
    mockedAuthService.checkAuthStatus.mockResolvedValueOnce({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });

    const { result } = renderHook(() => useAuth());

    // 1. El hook debe empezar con isLoading = true
    expect(result.current.isLoading).toBe(true);

    // 2. Esperamos a que la comprobación inicial termine
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 3. Verificamos el estado final después de la carga
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('debería hacer login exitosamente y actualizar el estado', async () => {
    // Estado inicial antes del login
    mockedAuthService.checkAuthStatus.mockResolvedValueOnce({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
    
    // El servicio de login devuelve un token y datos de usuario
    mockedAuthService.login.mockResolvedValueOnce({
      access_token: 'fake-token',
      isFirstLogin: true,
    });

    // Después del login, checkAuthStatus encontrará un usuario
    mockedAuthService.checkAuthStatus.mockResolvedValueOnce({
      isAuthenticated: true,
      isLoading: false,
      user: { isFirstLogin: true },
    });

    const { result } = renderHook(() => useAuth());

    // Esperamos a que la carga inicial termine
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Ejecutamos la acción de login dentro de act() porque actualiza el estado
    await act(async () => {
      await result.current.login('user', 'pass');
    });

    // Verificamos que el estado se haya actualizado correctamente
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({ isFirstLogin: true });
    expect(result.current.isLoading).toBe(false);
  });

  it('debería hacer logout y limpiar el estado', async () => {
    // El usuario empieza autenticado
    mockedAuthService.checkAuthStatus.mockResolvedValueOnce({
      isAuthenticated: true,
      isLoading: false,
      user: { isFirstLogin: false },
    });

    mockedAuthService.logout.mockResolvedValue();

    const { result } = renderHook(() => useAuth());

    // Esperamos a que cargue el estado autenticado
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    // Ejecutamos el logout
    await act(async () => {
      await result.current.logout();
    });

    // Verificamos que el estado se haya limpiado
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('debería manejar un error de login y mantener el estado anterior', async () => {
    mockedAuthService.checkAuthStatus.mockResolvedValueOnce({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });

    // El login ahora falla
    mockedAuthService.login.mockRejectedValueOnce(
      new Error('Invalid credentials'),
    );

    const { result } = renderHook(() => useAuth());

    // Esperamos a que termine la carga inicial
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Esperamos que la función de login lance una excepción
    await act(async () => {
      await expect(result.current.login('wrong', 'creds')).rejects.toThrow(
        'Invalid credentials',
      );
    });

    // Verificamos que el estado NO haya cambiado
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });
});