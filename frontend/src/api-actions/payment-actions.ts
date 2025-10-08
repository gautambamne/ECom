import axiosInstance from "@/lib/axios-interceptor";
import { ICreatePaymentSchema } from "@/schema/payment-schema";

export const PaymentActions = {
    // User routes (require authentication)
    CreatePaymentAction: async (data: ICreatePaymentSchema): Promise<ICreatePaymentResponse> => {
        const response = await axiosInstance.post<ApiResponse<ICreatePaymentResponse>>("/payments", data);
        return response.data.data;
    },

    GetPaymentAction: async (paymentId: string): Promise<IGetPaymentResponse> => {
        const response = await axiosInstance.get<ApiResponse<IGetPaymentResponse>>(`/payments/${paymentId}`);
        return response.data.data;
    },

    GetOrderPaymentsAction: async (orderId: string): Promise<{ payments: IPayment[] }> => {
        const response = await axiosInstance.get<ApiResponse<{ payments: IPayment[] }>>(`/payments/order/${orderId}`);
        return response.data.data;
    },

    GetUserPaymentsAction: async (page?: number, limit?: number): Promise<{ payments: IPayment[]; pagination: any }> => {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        
        const response = await axiosInstance.get<ApiResponse<{ payments: IPayment[]; pagination: any }>>(`/payments/user/me?${params.toString()}`);
        return response.data.data;
    },
};