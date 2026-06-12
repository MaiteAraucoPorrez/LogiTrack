import api from './api';
import type { ShipmentDto, ShipmentCreateRequest, ShipmentFilter } from '../types/shipment.types';
import type { ApiResponse } from '../types/api.types';

const BASE = '/api/v1/shipment';

export const getShipments = async (filter?: ShipmentFilter): Promise<ApiResponse<ShipmentDto[]>> => {
  const { data } = await api.get<ApiResponse<ShipmentDto[]>>(`${BASE}/dto/mapper`, { params: filter });
  return data;
};

export const getShipmentById = async (id: number): Promise<ApiResponse<ShipmentDto>> => {
  const { data } = await api.get<ApiResponse<ShipmentDto>>(`${BASE}/dto/mapper/${id}`);
  return data;
};

export const createShipment = async (request: ShipmentCreateRequest): Promise<ApiResponse<ShipmentDto>> => {
  const { data } = await api.post<ApiResponse<ShipmentDto>>(`${BASE}/dto/mapper/`, request);
  return data;
};

export const updateShipment = async (id: number, request: Partial<ShipmentDto>): Promise<ApiResponse<ShipmentDto>> => {
  const { data } = await api.put<ApiResponse<ShipmentDto>>(`${BASE}/dto/mapper/${id}`, { ...request, id });
  return data;
};

export const deleteShipment = async (id: number): Promise<ApiResponse<boolean>> => {
  const { data } = await api.delete<ApiResponse<boolean>>(`${BASE}/dto/mapper/${id}`);
  return data;
};
