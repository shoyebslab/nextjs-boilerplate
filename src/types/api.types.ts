export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface DRFPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  code?: string;
  non_field_errors?: string[];
  [key: string]: unknown;
}

export interface PaginationParams {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
}
