import { useAuthStore } from '@/stores/auth';
import { getAESKey, performHandshake, restoreCryptoState } from '@/utils/cryptoSession';
import axios, { type AxiosRequestConfig, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const api = axios.create({
  baseURL: API_BASE_URL || '/api',
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
      await restoreCryptoState();

      const token = localStorage.getItem(AUTH_TOKEN_KEY) || null;
      const sessionId = localStorage.getItem('sessionId') || null;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (sessionId) {
        console.log('Using existing session ID:', sessionId);
        config.headers['x-session-id'] = sessionId;
      } else {
        console.log('Performing handshake to retrieve session ID');
        await performHandshake(apiService);
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
  async (response) => {
    const data = response.data;
    if (data && data.encrypted && data.data) {
      const aesKey = getAESKey();
      console.log(data);

      if (!aesKey) {
        return response;
      }

      console.log('Frontend AES key:', btoa(String.fromCharCode(...aesKey)), 'Length:', aesKey.length);

      try {
        const payload = JSON.parse(data.data); // { iv, data }
        const iv = Uint8Array.from(atob(payload.iv), c => c.charCodeAt(0));
        const encryptedData = Uint8Array.from(atob(payload.data), c => c.charCodeAt(0));

        const cryptoKey = await window.crypto.subtle.importKey(
          'raw',
          aesKey,
          { name: 'AES-CBC' },
          false,
          ['decrypt']
        );

        const decrypted = await window.crypto.subtle.decrypt(
          { name: 'AES-CBC', iv },
          cryptoKey,
          encryptedData
        );

        const decoder = new TextDecoder();
        const decryptedText = decoder.decode(decrypted);
        const parsed = JSON.parse(decryptedText);
        response.data = parsed;
      } catch (err) {
        return Promise.reject(new Error("Erreur de déchiffrement"));
      }
    }

    return response;

  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 500)) {
      const auth = useAuthStore();
      auth.logout();
    }
    return Promise.reject(error);
  }
);


export const apiService = {
  get: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = (await api.get<T | EncryptedResponse>(url, config));
      return response.data as T;
    } catch (error) {
      console.error(`GET ${url} failed`, error);
      throw error;
    }
  },

  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = (await api.post<T | EncryptedResponse>(url, data, config));
      return response.data as T;
    } catch (error) {
      console.error(`POST ${url} failed`, error);
      throw error;
    }
  },

  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = (await api.put<T | EncryptedResponse>(url, data, config));
      return response.data as T;
    } catch (error) {
      console.error(`PUT ${url} failed`, error);
      throw error;
    }
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
      const response = (await api.delete<T | EncryptedResponse>(url, config));
      return response.data as T;
    } catch (error) {
      console.error(`DELETE ${url} failed`, error);
      throw error;
    }
  },
};
