import { jwtDecode } from 'jwt-decode';
import type { AuthUser, DecodedToken, RoleType } from '../types/auth.types';

const TOKEN_KEY = 'logitrack_auth_token';

export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const getUserFromToken = (token: string): AuthUser | null => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const name =
      decoded.name ??
      decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ??
      'User';
    const role =
      decoded.role ??
      decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      'Employee';
    const login = decoded.Login ?? decoded.login ?? '';
    return { name, login, role: role as RoleType };
  } catch {
    return null;
  }
};
