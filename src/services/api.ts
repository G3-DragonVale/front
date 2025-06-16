import { useAuthStore } from '@/stores/auth';
import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';
import * as CryptoJS from 'crypto-js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY as string;

const api = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface EncryptedResponse {
  encrypted: boolean;
  data: string;
}

const AUTH_TOKEN_KEY = 'userToken';

api.interceptors.request.use(
  async (config): Promise<InternalAxiosRequestConfig> => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY) || null;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Token ajouté à la requête pour:', config.url);
      } else {
        console.log('Aucun token trouvé, requête envoyée sans Authorization pour:', config.url);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du token depuis localStorage", error);
    }
    return config;
  },
  (error) => {
    console.error("Erreur de configuration de la requête Axios", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const auth = useAuthStore();
      auth.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const decryptApiResponse = <T>(response: T | EncryptedResponse): T => {
  if (response && typeof response === 'object' && 'encrypted' in response && response.encrypted) {
    const bytes = CryptoJS.AES.decrypt(response.data as string, ENCRYPTION_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

    try {
      return JSON.parse(decryptedData) as T;
    } catch (e) {
      return decryptedData as unknown as T;
    }
  }

  return response as T;
};

export const apiService = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = (await api.get<T | EncryptedResponse>(url, config));
      return decryptApiResponse<T>(response.data);
    } catch (error) {
      console.error(`GET ${url} failed`, error);
      throw error;
    }
  },

  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = (await api.post<T | EncryptedResponse>(url, data, config));
      return decryptApiResponse<T>(response.data);
    } catch (error) {
      console.error(`POST ${url} failed`, error);
      throw error;
    }
  },

  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = (await api.put<T | EncryptedResponse>(url, data, config));
      return decryptApiResponse<T>(response.data);
    } catch (error) {
      console.error(`PUT ${url} failed`, error);
      throw error;
    }
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = (await api.delete<T | EncryptedResponse>(url, config));
      return decryptApiResponse<T>(response.data);
    } catch (error) {
      console.error(`DELETE ${url} failed`, error);
      throw error;
    }
  },
};
