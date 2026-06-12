import api from './api';
import type { PackageDto, PackageCreateRequest, PackageFilter } from '../types/package.types';
import type { ApiResponse } from '../types/api.types';

const BASE = '/api/v1/package';

export const getPackages = async (filter?: PackageFilter): Promise<ApiResponse<PackageDto[]>> => {
  const { data } = await api.get<ApiResponse<PackageDto[]>>(`${BASE}/dto/mapper`, { params: filter });
  return data;
};

export const getPackageById = async (id: number): Promise<ApiResponse<PackageDto>> => {
  const { data } = await api.get<ApiResponse<PackageDto>>(`${BASE}/dto/mapper/${id}`);
  return data;
};

export const createPackage = async (request: PackageCreateRequest): Promise<ApiResponse<PackageDto>> => {
  const { data } = await api.post<ApiResponse<PackageDto>>(BASE, request);
  return data;
};

export const updatePackage = async (id: number, request: PackageCreateRequest): Promise<ApiResponse<PackageDto>> => {
  const { data } = await api.put<ApiResponse<PackageDto>>(`${BASE}/dto/mapper/${id}`, { ...request, id });
  return data;
};

export const deletePackage = async (id: number): Promise<ApiResponse<boolean>> => {
  const { data } = await api.delete<ApiResponse<boolean>>(`${BASE}/dto/mapper/${id}`);
  return data;
};
