import api from './api';
import type { DriverDto, DriverCreateRequest, DriverFilter } from '../types/driver.types';
import type { ApiResponse } from '../types/api.types';

const BASE = '/api/v1/driver';

export const getDrivers = async (filter?: DriverFilter): Promise<ApiResponse<DriverDto[]>> => {
  const { data } = await api.get<ApiResponse<DriverDto[]>>(`${BASE}/dto/mapper`, { params: filter });
  return data;
};

export const getDriverById = async (id: number): Promise<ApiResponse<DriverDto>> => {
  const { data } = await api.get<ApiResponse<DriverDto>>(`${BASE}/dto/mapper/${id}`);
  return data;
};

export const createDriver = async (request: DriverCreateRequest): Promise<ApiResponse<DriverDto>> => {
  const { data } = await api.post<ApiResponse<DriverDto>>(BASE, request);
  return data;
};

export const updateDriver = async (id: number, request: DriverCreateRequest): Promise<ApiResponse<DriverDto>> => {
  const { data } = await api.put<ApiResponse<DriverDto>>(`${BASE}/dto/mapper/${id}`, { ...request, id });
  return data;
};

export const deleteDriver = async (id: number): Promise<ApiResponse<boolean>> => {
  const { data } = await api.delete<ApiResponse<boolean>>(`${BASE}/dto/mapper/${id}`);
  return data;
};
