import api from './api';
import type { RouteDto, RouteCreateRequest, RouteFilter } from '../types/route.types';
import type { ApiResponse } from '../types/api.types';

const BASE = '/api/v1/route';

export const getRoutes = async (filter?: RouteFilter): Promise<ApiResponse<RouteDto[]>> => {
  const { data } = await api.get<ApiResponse<RouteDto[]>>(`${BASE}/dto/mapper`, { params: filter });
  return data;
};

export const getRouteById = async (id: number): Promise<ApiResponse<RouteDto>> => {
  const { data } = await api.get<ApiResponse<RouteDto>>(`${BASE}/dto/mapper/${id}`);
  return data;
};

export const createRoute = async (request: RouteCreateRequest): Promise<ApiResponse<RouteDto>> => {
  const { data } = await api.post<ApiResponse<RouteDto>>(BASE, request);
  return data;
};

export const updateRoute = async (id: number, request: RouteCreateRequest): Promise<ApiResponse<RouteDto>> => {
  const { data } = await api.put<ApiResponse<RouteDto>>(`${BASE}/dto/mapper/${id}`, { ...request, id });
  return data;
};

export const deleteRoute = async (id: number): Promise<ApiResponse<boolean>> => {
  const { data } = await api.delete<ApiResponse<boolean>>(`${BASE}/dto/mapper/${id}`);
  return data;
};
