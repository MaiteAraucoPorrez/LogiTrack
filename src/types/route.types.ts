export interface RouteDto {
  id: number;
  origin: string;
  destination: string;
  distanceKm: number;
  baseCost: number;
  isActive: boolean;
}

export interface RouteCreateRequest {
  origin: string;
  destination: string;
  distanceKm: number;
  baseCost: number;
  isActive?: boolean;
}

export interface RouteFilter {
  pageNumber?: number;
  pageSize?: number;
}
