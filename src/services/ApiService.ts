import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Config from 'react-native-config';
import { storageService } from './StorageService';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  isFirstLogin: boolean;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: Config.API_BASE_URL || 'http://10.0.2.2:3000',
      timeout: Number(Config.API_TIMEOUT) || 15000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Permitir que axios lance errores para códigos 4xx y 5xx
      validateStatus: (status) => status >= 200 && status < 300,
    });

    // Interceptor para agregar token
    this.api.interceptors.request.use(async (config) => {
      const token = await storageService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para manejo de errores de respuesta
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.log('API Error:', error.response?.status, error.response?.data);
        
        if (error.response) {
          // El servidor respondió con un código de error
          const status = error.response.status;
          const data = error.response.data;
          
          switch (status) {
            case 401:
              throw new Error('Invalid credentials. Please check your username and password.');
            case 403:
              throw new Error('Access denied. Please contact support.');
            case 404:
              throw new Error('Service not found. Please contact support.');
            case 500:
              throw new Error('Server error. Please try again later.');
            default:
              throw new Error(data?.message || 'An unexpected error occurred.');
          }
        } else if (error.request) {
          // La petición se hizo pero no hubo respuesta
          throw new Error('Unable to connect to server. Please check your internet connection.');
        } else {
          // Error en la configuración de la petición
          throw new Error('Request error. Please try again.');
        }
      }
    );
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      console.log('Attempting login with:', { username: credentials.username, password: '***' });
      const res = await this.api.post<LoginResponse>('/auth/login', credentials);
      console.log('Login response status:', res.status);
      console.log('Login response data:', res.data);
      
      // Verificar si la respuesta contiene los datos esperados
      if (!res.data.access_token) {
        throw new Error('Invalid response from server. Missing access token.');
      }
      
      return res.data;
    } catch (error) {
      console.log('Login error caught:', error);
      throw error;
    }
  }
  
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

export const apiService = new ApiService();
