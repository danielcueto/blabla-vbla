/**
 * Estructura base de respuesta del API
 */
export interface ApiResponse<T> {
  code: number;
  status: string;
  message: string;
  data: T;
}

/**
 * Tipos de datos específicos para diferentes endpoints
 */
export interface LoginResponseData {
  access_token: string;
  isFirstLogin: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Respuestas específicas que extienden la estructura base
 */
export type LoginResponse = ApiResponse<LoginResponseData>;
