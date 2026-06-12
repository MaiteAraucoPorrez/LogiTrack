import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { AuthUser, LoginRequest, RoleType } from '../types/auth.types';
import { login as loginService } from '../services/authService';
import { saveToken, getToken, removeToken, isTokenValid, getUserFromToken } from '../utils/tokenUtils';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  hasRole: (role: RoleType) => boolean;
}

export const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getToken();
    if (storedToken && isTokenValid(storedToken)) {
      const u = getUserFromToken(storedToken);
      setUser(u);
      setToken(storedToken);
    } else {
      removeToken();
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await loginService(credentials);
    saveToken(response.token);
    const u = getUserFromToken(response.token);
    setUser(u);
    setToken(response.token);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    setToken(null);
  }, []);

  const hasRole = useCallback(
    (role: RoleType) => user?.role === role,
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        isAdmin: user?.role === 'Administrator',
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
