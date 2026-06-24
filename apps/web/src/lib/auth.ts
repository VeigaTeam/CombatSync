import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import type { User } from '@/types';

const ACCESS_TOKEN_KEY = 'cs_access_token';
const REFRESH_TOKEN_KEY = 'cs_refresh_token';

interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  clinicId: string;
  exp: number;
  iat: number;
}

// ─── Token management ────────────────────────────────────────────────────────

export function setTokens(accessToken: string, refreshToken: string): void {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, {
    expires: 1, // 1 day
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, {
    expires: 30, // 30 days
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
  });
}

export function clearTokens(): void {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
}

export function getAccessToken(): string | undefined {
  return Cookies.get(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | undefined {
  return Cookies.get(REFRESH_TOKEN_KEY);
}

// ─── JWT helpers ─────────────────────────────────────────────────────────────

export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const payload = decodeToken(token);
  if (!payload) return true;
  // 30 second buffer
  return payload.exp * 1000 < Date.now() + 30_000;
}

export function isAuthenticated(): boolean {
  const token = getAccessToken();
  if (!token) return false;
  return !isTokenExpired(token);
}

// ─── User from token ─────────────────────────────────────────────────────────

export function getUserFromToken(token: string): Partial<User> | null {
  const payload = decodeToken(token);
  if (!payload) return null;
  return {
    id: payload.sub,
    email: payload.email,
    role: payload.role as User['role'],
    clinicId: payload.clinicId,
  };
}

// ─── Permission checks ────────────────────────────────────────────────────────

export function hasRole(user: User | null, roles: User['role'][]): boolean {
  if (!user) return false;
  return roles.includes(user.role);
}

export function canManageUsers(user: User | null): boolean {
  return hasRole(user, ['owner', 'admin']);
}

export function canManageFinancials(user: User | null): boolean {
  return hasRole(user, ['owner', 'admin']);
}

export function canManageSettings(user: User | null): boolean {
  return hasRole(user, ['owner']);
}
