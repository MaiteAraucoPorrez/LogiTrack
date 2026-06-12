export interface DriverDto {
  id: number;
  fullName: string;
  licenseNumber: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  dateOfBirth: string;
  isActive: boolean;
  status: string;
  currentVehicleId?: number;
  totalDeliveries: number;
}

export interface DriverCreateRequest {
  fullName: string;
  licenseNumber: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  dateOfBirth: string;
  isActive?: boolean;
  status: string;
}

export interface DriverFilter {
  pageNumber?: number;
  pageSize?: number;
}

export const DRIVER_STATUS_VALUES = ['Available', 'OnRoute', 'OffDuty', 'OnLeave'] as const;
export type DriverStatusType = typeof DRIVER_STATUS_VALUES[number];

export const DRIVER_STATUS_LABELS: Record<string, string> = {
  Available: 'Available',
  OnRoute: 'On Route',
  OffDuty: 'Off Duty',
  OnLeave: 'On Leave',
};
