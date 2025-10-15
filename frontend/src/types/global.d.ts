/// <reference path="./auth.d.ts" />

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

// Vendor types
interface IVendor {
  id: string;
  shop_name: string;
  phone_number?: string;
  gst_number?: string;
  pan_number?: string;
  shop_address?: string;
  status: VendorStatus;
  created_at: string;
  User?: {
    id: string;
    name?: string;
    email?: string;
  };
}

type VendorStatus = "APPROVED" | "PENDING" | "REJECTED" | "SUSPENDED";

interface IGetVendorsResponse {
  vendors: IVendor[];
  total: number;
  totalPages: number;
  currentPage: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  suspendedCount: number;
}

interface IVendorQuerySchema {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: VendorStatus;
}
