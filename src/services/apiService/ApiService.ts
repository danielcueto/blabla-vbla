import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Config from 'react-native-config';
import { storageService } from '../StorageService/StorageService';

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
      validateStatus: (status) => status >= 200 && status < 300,
    });

    this.api.interceptors.request.use(async (config) => {
      const token = await storageService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const res = await this.api.post<LoginResponse>('/auth/login', credentials);
      if (!res.data.access_token) {
        throw new Error('Invalid response from server. Missing access token.');
      }
      return res.data;
    } catch (error) {
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
