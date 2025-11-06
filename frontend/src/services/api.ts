// src/services/api.ts
import axios, { AxiosError } from 'axios';
import type {
  Book,
  Genre,
  Transaction,
  CreateTransactionRequest,
  PaginatedResponse,
  ApiError
} from './types'; // Pastikan path ini benar

// GANTI INI dengan URL API backend Anda (dari Modul 3)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use((config) => {
  // Gunakan 'authToken' sesuai dengan yang Anda simpan di Login.tsx
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor untuk handle error 401 (Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Jika token tidak valid / expired
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken'); // Hapus token yang salah
      localStorage.removeItem('userEmail'); // Hapus juga email
      alert("Sesi Anda telah berakhir. Silakan login kembali.");
      window.location.href = '/login'; // Paksa reload ke /login
    }
    return Promise.reject(error);
  }
);

// === Book API ===
export const bookApi = {
  getAll: async (params?: {
    search?: string;
    condition?: string;
    sort?: string; // misal: 'title:asc' atau 'publish_date:desc'
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get<PaginatedResponse<Book>>('/books', { params });
    return response.data;
  },

  getById: async (id: number | string) => {
    const response = await api.get<Book>(`/books/${id}`);
    return response.data;
  },

  // 'data' bisa jadi FormData jika Anda upload gambar
  create: async (data: Partial<Book>) => {
    const response = await api.post<Book>('/books', data);
    return response.data;
  },

  update: async (id: number | string, data: Partial<Book>) => {
    const response = await api.put<Book>(`/books/${id}`, data);
    return response.data;
  },

  delete: async (id: number | string) => {
    await api.delete(`/books/${id}`);
  },
};

// === Genre API ===
export const genreApi = {
  getAll: async () => {
    const response = await api.get<Genre[]>('/genres');
    return response.data;
  },
};

// === Transaction API ===
export const transactionApi = {
  getAll: async (params?: {
    search?: string; // search by id
    sort?: string; // order by id, amount, price
    page?: number;
    limit?: number;
  }) => {
    const response = await api.get<PaginatedResponse<Transaction>>('/transactions', { params });
    return response.data;
  },

  getById: async (id: number | string) => {
    const response = await api.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: CreateTransactionRequest) => {
    const response = await api.post<Transaction>('/transactions', data);
    return response.data;
  },
};

export default api;