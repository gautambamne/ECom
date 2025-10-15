import axiosInstance from "@/lib/axios-interceptor";

export const VendorActions = {
    // Admin routes - Get all vendors with filtering and pagination
    getAllVendors: async (query?: IVendorQuerySchema): Promise<IGetVendorsResponse> => {
        const params = new URLSearchParams();
        if (query) {
            Object.entries(query).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString());
                }
            });
        }
        const response = await axiosInstance.get<ApiResponse<IGetVendorsResponse>>(`/admin/vendors?${params.toString()}`);
        return response.data.data;
    },

    // Get vendor by ID
    getVendorById: async (vendorId: string): Promise<IVendor> => {
        const response = await axiosInstance.get<ApiResponse<IVendor>>(`/admin/vendors/${vendorId}`);
        return response.data.data;
    },

    // Update vendor status
    updateVendorStatus: async (vendorId: string, status: VendorStatus): Promise<IUniversalMessageResponse> => {
        const response = await axiosInstance.patch<ApiResponse<IUniversalMessageResponse>>(`/admin/vendors/${vendorId}/status`, { status });
        return response.data.data;
    },

    // Delete vendor by ID
    deleteVendorById: async (vendorId: string): Promise<IUniversalMessageResponse> => {
        const response = await axiosInstance.delete<ApiResponse<IUniversalMessageResponse>>(`/admin/vendors/${vendorId}`);
        return response.data.data;
    },
};