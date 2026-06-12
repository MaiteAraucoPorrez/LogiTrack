export interface ShipmentDto {
  id: number;
  shippingDate: string;
  state: string;
  customerId: number;
  routeId: number;
  totalCost: number;
  trackingNumber: string;
  packages?: ShipmentPackageDto[];
}

export interface ShipmentPackageDto {
  id: number;
  description: string;
  weight: number;
  price: number;
}

export interface ShipmentCreateRequest {
  shippingDate: string;
  state: string;
  customerId: number;
  routeId: number;
  totalCost: number;
  trackingNumber: string;
}

export interface ShipmentFilter {
  pageNumber?: number;
  pageSize?: number;
  customerId?: number;
  state?: string;
}

export const SHIPMENT_STATES = ['Pending', 'In transit', 'Delivered'] as const;
export type ShipmentState = typeof SHIPMENT_STATES[number];
