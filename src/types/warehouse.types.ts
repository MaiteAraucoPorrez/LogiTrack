export interface WarehouseDto {
  id: number;
  name: string;
  code: string;
  address: string;
  city: string;
  department: string;
  phone: string;
  email?: string;
  maxCapacityM3: number;
  currentCapacityM3: number;
  isActive: boolean;
  type: string;
  operatingHours?: string;
  managerName?: string;
}

export interface WarehouseCreateRequest {
  name: string;
  code: string;
  address: string;
  city: string;
  department: string;
  phone: string;
  email?: string;
  maxCapacityM3: number;
  type: string;
  operatingHours?: string;
  managerName?: string;
}

export interface WarehouseFilter {
  pageNumber?: number;
  pageSize?: number;
}

export const WAREHOUSE_TYPE_VALUES = ['Central', 'Regional', 'Local'] as const;
export type WarehouseTypeVal = typeof WAREHOUSE_TYPE_VALUES[number];
