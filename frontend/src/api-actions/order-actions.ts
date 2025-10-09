import axiosInstance from "@/lib/axios-interceptor";
import { ICreateOrderSchema, IUpdateOrderStatusSchema } from "@/schema/order.schema";

export const OrderActions = {
    // User routes (require authentication)
    CreateOrderAction: async (data: ICreateOrderSchema): Promise<ICreateOrderResponse> => {
        const response = await axiosInstance.post<ApiResponse<ICreateOrderResponse>>("/orders", data);
        return response.data.data;
    },

    GetOrderAction: async (orderId: string): Promise<IGetOrderResponse> => {
        const response = await axiosInstance.get<ApiResponse<IGetOrderResponse>>(`/orders/${orderId}`);
        return response.data.data;
    },

    GetUserOrdersAction: async (page?: number, limit?: number): Promise<IGetOrdersResponse> => {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        
        const response = await axiosInstance.get<ApiResponse<IGetOrdersResponse>>(`/orders/user/me?${params.toString()}`);
        return response.data.data;
    },

    // Admin/Vendor routes (require authentication and appropriate role)
    UpdateOrderStatusAction: async (orderId: string, data: IUpdateOrderStatusSchema): Promise<IUpdateOrderResponse> => {
        const response = await axiosInstance.put<ApiResponse<IUpdateOrderResponse>>(`/orders/${orderId}/status`, data);
        return response.data.data;
    },

    GetAllOrdersAction: async (page?: number, limit?: number, status?: string): Promise<IGetOrdersResponse> => {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        if (status) params.append('status', status);
        
        const response = await axiosInstance.get<ApiResponse<IGetOrdersResponse>>(`/orders?${params.toString()}`);
        return response.data.data;
    },
};