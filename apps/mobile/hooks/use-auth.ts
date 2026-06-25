import { useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/lib/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login({ email, password }: LoginCredentials) {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      await SecureStore.setItemAsync('access_token', data.access_token);
      setUser(data.user);
      return data;
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Erro ao fazer login';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await SecureStore.deleteItemAsync('access_token');
    setUser(null);
  }

  return { user, loading, error, login, logout };
}
