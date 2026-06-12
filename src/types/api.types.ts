export interface ApiResponse<T> {
  messages: ApiMessage[];
  data: T;
  pagination?: Pagination;
}

export interface ApiMessage {
  type: string;
  text: string;
}

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
