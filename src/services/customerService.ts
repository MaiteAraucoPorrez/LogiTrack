import api from './api';
import type { CustomerDto, CustomerCreateRequest, CustomerFilter } from '../types/customer.types';
import type { ApiResponse } from '../types/api.types';

const BASE = '/api/v1/customer';

export const getCustomers = async (filter?: CustomerFilter): Promise<ApiResponse<CustomerDto[]>> => {
  const { data } = await api.get<ApiResponse<CustomerDto[]>>(`${BASE}/dto/mapper`, { params: filter });
  return data;
};

export const getCustomerById = async (id: number): Promise<ApiResponse<CustomerDto>> => {
  const { data } = await api.get<ApiResponse<CustomerDto>>(`${BASE}/dto/mapper/${id}`);
  return data;
};

export const createCustomer = async (request: CustomerCreateRequest): Promise<ApiResponse<CustomerDto>> => {
  const { data } = await api.post<ApiResponse<CustomerDto>>(BASE, request);
  return data;
};

export const updateCustomer = async (id: number, request: CustomerCreateRequest): Promise<ApiResponse<CustomerDto>> => {
  const { data } = await api.put<ApiResponse<CustomerDto>>(`${BASE}/dto/mapper/${id}`, { ...request, id });
  return data;
};

export const deleteCustomer = async (id: number): Promise<ApiResponse<boolean>> => {
  const { data } = await api.delete<ApiResponse<boolean>>(`${BASE}/dto/mapper/${id}`);
  return data;
};
