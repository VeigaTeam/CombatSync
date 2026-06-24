import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// ─── Request interceptor — attach access token ────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('cs_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor — handle 401 / token refresh ───────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: AxiosError | null, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = Cookies.get('cs_refresh_token');

      if (!refreshToken) {
        processQueue(error, null);
        isRefreshing = false;
        Cookies.remove('cs_access_token');
        Cookies.remove('cs_refresh_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/api/v1/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = data.tokens;
        Cookies.set('cs_access_token', accessToken, { expires: 1 });
        Cookies.set('cs_refresh_token', newRefreshToken, { expires: 30 });

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);
        Cookies.remove('cs_access_token');
        Cookies.remove('cs_refresh_token');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ─── API helpers ─────────────────────────────────────────────────────────────

export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Ocorreu um erro inesperado.';
}

// ─── Typed API endpoints ──────────────────────────────────────────────────────

import type {
  Appointment,
  AppointmentFilters,
  Client,
  ClientFilters,
  ClientPackage,
  ClientStats,
  CreateAppointmentRequest,
  DashboardStats,
  LoginRequest,
  AuthResponse,
  Package,
  PaginatedResponse,
  RevenueChartData,
  Service,
  Space,
  Transaction,
  UpdateAppointmentRequest,
  User,
  BusinessHours,
} from '@/types';

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
  me: () => api.get<User>('/auth/me').then((r) => r.data),
  refresh: (refreshToken: string) =>
    api.post<AuthResponse>('/auth/refresh', { refreshToken }).then((r) => r.data),
};

export const appointmentsApi = {
  list: (filters?: AppointmentFilters) =>
    api.get<Appointment[]>('/appointments', { params: filters }).then((r) => r.data),
  get: (id: string) =>
    api.get<Appointment>(`/appointments/${id}`).then((r) => r.data),
  create: (data: CreateAppointmentRequest) =>
    api.post<Appointment>('/appointments', data).then((r) => r.data),
  update: (id: string, data: UpdateAppointmentRequest) =>
    api.patch<Appointment>(`/appointments/${id}`, data).then((r) => r.data),
  cancel: (id: string, reason?: string) =>
    api.patch<Appointment>(`/appointments/${id}/cancel`, { reason }).then((r) => r.data),
  complete: (id: string) =>
    api.patch<Appointment>(`/appointments/${id}/complete`).then((r) => r.data),
  confirm: (id: string) =>
    api.patch<Appointment>(`/appointments/${id}/confirm`).then((r) => r.data),
};

export const clientsApi = {
  list: (filters?: ClientFilters) =>
    api.get<PaginatedResponse<Client>>('/clients', { params: filters }).then((r) => r.data),
  get: (id: string) =>
    api.get<Client>(`/clients/${id}`).then((r) => r.data),
  getStats: (id: string) =>
    api.get<ClientStats>(`/clients/${id}/stats`).then((r) => r.data),
  getPackages: (id: string) =>
    api.get<ClientPackage[]>(`/clients/${id}/packages`).then((r) => r.data),
  getAppointments: (id: string) =>
    api.get<Appointment[]>(`/clients/${id}/appointments`).then((r) => r.data),
  create: (data: Partial<Client>) =>
    api.post<Client>('/clients', data).then((r) => r.data),
  update: (id: string, data: Partial<Client>) =>
    api.patch<Client>(`/clients/${id}`, data).then((r) => r.data),
  deactivate: (id: string) =>
    api.patch<Client>(`/clients/${id}/deactivate`).then((r) => r.data),
};

export const servicesApi = {
  list: () => api.get<Service[]>('/services').then((r) => r.data),
  get: (id: string) => api.get<Service>(`/services/${id}`).then((r) => r.data),
  create: (data: Partial<Service>) =>
    api.post<Service>('/services', data).then((r) => r.data),
  update: (id: string, data: Partial<Service>) =>
    api.patch<Service>(`/services/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/services/${id}`).then((r) => r.data),
};

export const spacesApi = {
  list: () => api.get<Space[]>('/spaces').then((r) => r.data),
  get: (id: string) => api.get<Space>(`/spaces/${id}`).then((r) => r.data),
  create: (data: Partial<Space>) =>
    api.post<Space>('/spaces', data).then((r) => r.data),
  update: (id: string, data: Partial<Space>) =>
    api.patch<Space>(`/spaces/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/spaces/${id}`).then((r) => r.data),
};

export const packagesApi = {
  list: () => api.get<Package[]>('/packages').then((r) => r.data),
  get: (id: string) => api.get<Package>(`/packages/${id}`).then((r) => r.data),
  create: (data: Partial<Package>) =>
    api.post<Package>('/packages', data).then((r) => r.data),
  update: (id: string, data: Partial<Package>) =>
    api.patch<Package>(`/packages/${id}`, data).then((r) => r.data),
  assignToClient: (packageId: string, clientId: string) =>
    api.post<ClientPackage>(`/packages/${packageId}/assign`, { clientId }).then((r) => r.data),
};

export const dashboardApi = {
  getStats: () =>
    api.get<DashboardStats>('/dashboard/stats').then((r) => r.data),
  getRevenueChart: (months = 6) =>
    api.get<RevenueChartData[]>('/dashboard/revenue', { params: { months } }).then((r) => r.data),
  getAppointmentsToday: () =>
    api.get<Appointment[]>('/dashboard/appointments-today').then((r) => r.data),
};

export const financialApi = {
  list: (params?: { startDate?: string; endDate?: string; type?: string }) =>
    api.get<PaginatedResponse<Transaction>>('/transactions', { params }).then((r) => r.data),
};

export const settingsApi = {
  getBusinessHours: () =>
    api.get<BusinessHours[]>('/settings/business-hours').then((r) => r.data),
  updateBusinessHours: (hours: BusinessHours[]) =>
    api.put<BusinessHours[]>('/settings/business-hours', { hours }).then((r) => r.data),
};
