import api from './api';
import type { AddressDto, AddressCreateRequest, AddressFilter } from '../types/address.types';
import type { ApiResponse } from '../types/api.types';

const BASE = '/api/v1/address';

export const getAddresses = async (filter?: AddressFilter): Promise<ApiResponse<AddressDto[]>> => {
  const { data } = await api.get<ApiResponse<AddressDto[]>>(`${BASE}/dto/mapper`, { params: filter });
  return data;
};

export const getAddressById = async (id: number): Promise<ApiResponse<AddressDto>> => {
  const { data } = await api.get<ApiResponse<AddressDto>>(`${BASE}/dto/mapper/${id}`);
  return data;
};

export const createAddress = async (request: AddressCreateRequest): Promise<ApiResponse<AddressDto>> => {
  const { data } = await api.post<ApiResponse<AddressDto>>(BASE, request);
  return data;
};

export const updateAddress = async (id: number, request: AddressCreateRequest): Promise<ApiResponse<AddressDto>> => {
  const { data } = await api.put<ApiResponse<AddressDto>>(`${BASE}/dto/mapper/${id}`, { ...request, id });
  return data;
};

export const deleteAddress = async (id: number): Promise<ApiResponse<boolean>> => {
  const { data } = await api.delete<ApiResponse<boolean>>(`${BASE}/dto/mapper/${id}`);
  return data;
};
