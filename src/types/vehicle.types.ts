export interface VehicleDto {
  id: number;
  plateNumber: string;
  type: string;
  maxWeightCapacityKg: number;
  maxVolumeCapacityM3: number;
  currentWeightKg: number;
  currentVolumeM3: number;
  status: string;
  vin?: string;
  isActive: boolean;
  baseWarehouseId?: number;
  assignedDriverId?: number;
}

export interface VehicleCreateRequest {
  plateNumber: string;
  type: string;
  maxWeightCapacityKg: number;
  maxVolumeCapacityM3: number;
  status: string;
  vin?: string;
  isActive?: boolean;
  baseWarehouseId?: number;
}

export interface VehicleFilter {
  pageNumber?: number;
  pageSize?: number;
}

export const VEHICLE_TYPE_VALUES = ['Motorcycle', 'Van', 'Pickup', 'Truck'] as const;
export type VehicleTypeVal = typeof VEHICLE_TYPE_VALUES[number];

export const VEHICLE_STATUS_VALUES = ['Available', 'InTransit', 'Maintenance', 'OutOfService'] as const;
export type VehicleStatusType = typeof VEHICLE_STATUS_VALUES[number];

export const VEHICLE_STATUS_LABELS: Record<string, string> = {
  Available: 'Available',
  InTransit: 'In Transit',
  Maintenance: 'Maintenance',
  OutOfService: 'Out of Service',
};
