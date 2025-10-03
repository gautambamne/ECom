interface ApiResponse<T> {
  local_date_time: string;
  data: T;
  api_error: ApiError | null;
}

interface ApiError {
  status_code: number;
  message: string;
  errors: Record<string, string>;
}

interface IUniversalMessageResponse {
  message: string;
}
