import api from './api';
import type { VehicleDto, VehicleCreateRequest, VehicleFilter } from '../types/vehicle.types';
import type { ApiResponse } from '../types/api.types';

const BASE = '/api/v1/vehicle';

export const getVehicles = async (filter?: VehicleFilter): Promise<ApiResponse<VehicleDto[]>> => {
  const { data } = await api.get<ApiResponse<VehicleDto[]>>(`${BASE}/dto/mapper`, { params: filter });
  return data;
};

export const getVehicleById = async (id: number): Promise<ApiResponse<VehicleDto>> => {
  const { data } = await api.get<ApiResponse<VehicleDto>>(`${BASE}/dto/mapper/${id}`);
  return data;
};

export const createVehicle = async (request: VehicleCreateRequest): Promise<ApiResponse<VehicleDto>> => {
  const { data } = await api.post<ApiResponse<VehicleDto>>(BASE, request);
  return data;
};

export const updateVehicle = async (id: number, request: VehicleCreateRequest): Promise<ApiResponse<VehicleDto>> => {
  const { data } = await api.put<ApiResponse<VehicleDto>>(`${BASE}/dto/mapper/${id}`, { ...request, id });
  return data;
};

export const deleteVehicle = async (id: number): Promise<ApiResponse<boolean>> => {
  const { data } = await api.delete<ApiResponse<boolean>>(`${BASE}/dto/mapper/${id}`);
  return data;
};
