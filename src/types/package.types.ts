export interface PackageDto {
  id: number;
  description: string;
  weight: number;
  shipmentId: number;
  price: number;
}

export interface PackageCreateRequest {
  description: string;
  weight: number;
  shipmentId: number;
  price: number;
}

export interface PackageFilter {
  pageNumber?: number;
  pageSize?: number;
}
