export interface LoginRequest {
  user: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface DecodedToken {
  name?: string;
  role?: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
  Login?: string;
  login?: string;
  exp: number;
  nbf: number;
  iss: string;
  aud: string | string[];
}

export type RoleType = 'Administrator' | 'Employee' | 'Customer';

export interface AuthUser {
  name: string;
  login: string;
  role: RoleType;
}

export interface SecurityCreateRequest {
  login: string;
  password: string;
  name: string;
  role: number;
}
