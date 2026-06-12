import api from './api';
import type { LoginRequest, LoginResponse, SecurityCreateRequest } from '../types/auth.types';
import type { ApiResponse } from '../types/api.types';

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const { data } = await api.post<LoginResponse>('/api/token/login', credentials);
  return data;
};

export const register = async (request: SecurityCreateRequest): Promise<ApiResponse<unknown>> => {
  const { data } = await api.post<ApiResponse<unknown>>('/api/security', request);
  return data;
};
