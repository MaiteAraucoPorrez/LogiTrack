export interface CustomerDto {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface CustomerCreateRequest {
  name: string;
  email: string;
  phone: string;
}

export interface CustomerFilter {
  name?: string;
  email?: string;
  pageNumber?: number;
  pageSize?: number;
}
