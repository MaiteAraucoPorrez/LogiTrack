import api from './api';
import type { WarehouseDto, WarehouseCreateRequest, WarehouseFilter } from '../types/warehouse.types';
import type { ApiResponse } from '../types/api.types';

const BASE = '/api/v1/warehouse';

export const getWarehouses = async (filter?: WarehouseFilter): Promise<ApiResponse<WarehouseDto[]>> => {
  const { data } = await api.get<ApiResponse<WarehouseDto[]>>(`${BASE}/dto/mapper`, { params: filter });
  return data;
};

export const getWarehouseById = async (id: number): Promise<ApiResponse<WarehouseDto>> => {
  const { data } = await api.get<ApiResponse<WarehouseDto>>(`${BASE}/dto/mapper/${id}`);
  return data;
};

export const createWarehouse = async (request: WarehouseCreateRequest): Promise<ApiResponse<WarehouseDto>> => {
  const { data } = await api.post<ApiResponse<WarehouseDto>>(BASE, request);
  return data;
};

export const updateWarehouse = async (id: number, request: WarehouseCreateRequest): Promise<ApiResponse<WarehouseDto>> => {
  const { data } = await api.put<ApiResponse<WarehouseDto>>(`${BASE}/dto/mapper/${id}`, { ...request, id });
  return data;
};

export const deleteWarehouse = async (id: number): Promise<ApiResponse<boolean>> => {
  const { data } = await api.delete<ApiResponse<boolean>>(`${BASE}/dto/mapper/${id}`);
  return data;
};
