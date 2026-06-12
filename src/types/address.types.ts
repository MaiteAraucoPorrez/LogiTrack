export interface AddressDto {
  id: number;
  customerId: number;
  street: string;
  city: string;
  department: string;
  zone?: string;
  type: string;
  isDefault: boolean;
  reference?: string;
  contactName?: string;
  contactPhone?: string;
  isActive: boolean;
}

export interface AddressCreateRequest {
  customerId: number;
  street: string;
  city: string;
  department: string;
  zone?: string;
  type: string;
  isDefault?: boolean;
  reference?: string;
  contactName?: string;
  contactPhone?: string;
}

export interface AddressFilter {
  pageNumber?: number;
  pageSize?: number;
  customerId?: number;
}

export const ADDRESS_TYPE_VALUES = ['Pickup', 'Delivery'] as const;
export type AddressTypeVal = typeof ADDRESS_TYPE_VALUES[number];
