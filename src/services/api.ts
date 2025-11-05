import axios, { AxiosError } from 'axios';
import type {
  Book,
  Genre,
  Transaction,
  CreateTransactionRequest,
  PaginatedResponse,
  ApiError
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor untuk handle error
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Book API
export const bookApi = {
  getAll: async (params?: {
    search?: string;
    condition?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get<PaginatedResponse<Book>>('/books', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Book>(`/books/${id}`);
    return response.data;
  },

  create: async (data: Partial<Book>) => {
    const response = await api.post<Book>('/books', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Book>) => {
    const response = await api.put<Book>(`/books/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/books/${id}`);
  },
};

// Genre API
export const genreApi = {
  getAll: async () => {
    const response = await api.get<Genre[]>('/genres');
    return response.data;
  },
};

// Transaction API
export const transactionApi = {
  getAll: async (params?: {
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get<PaginatedResponse<Transaction>>('/transactions', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: CreateTransactionRequest) => {
    const response = await api.post<Transaction>('/transactions', data);
    return response.data;
  },
};

export default api;

export const bookApi = {
  getAll: async (params?: {
    search?: string;
    condition?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get<PaginatedResponse<Book>>('/books', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<Book>(`/books/${id}`);
    return response.data;
  },

  create: async (data: Partial<Book>) => {
    const response = await api.post<Book>('/books', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Book>) => {
    const response = await api.put<Book>(`/books/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await api.delete(`/books/${id}`);
  },
};

export const genreApi = {
  getAll: async () => {
    const response = await api.get<Genre[]>('/genres');
    return response.data;
  },
};