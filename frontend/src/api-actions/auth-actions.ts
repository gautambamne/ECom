import axiosInstance from "@/lib/axios-interceptor";
import { ICheckVerificationCodeSchema, IForgotPasswordSchema, ILoginSchema, IRegistrationSchema, IResendVerificationCodeSchema, IResetPasswordSchema, IVerifySchema } from "@/schema/auth-schema";

export const AuthActions = {
    RegisterAction: async (data: IRegistrationSchema): Promise<IRegistrationResponse>=>{
        const response = await axiosInstance.post<ApiResponse<IRegistrationResponse>>("/auth/register", data)
        return response.data.data
    },

    VerifyAction: async (data: IVerifySchema): Promise<IUniversalMessageResponse>=>{
        const response = await axiosInstance.post<ApiResponse<IUniversalMessageResponse>>("/auth/verify", data)
        return response.data.data
    },

    LoginAction: async (data: ILoginSchema): Promise<ILoginResposne>=>{
        const response = await axiosInstance.post<ApiResponse<ILoginResposne>>("/auth/login", data)
        return response.data.data
    },

    RefreshAction: async(): Promise<IRefreshResponse>=>{
        const response = await axiosInstance.post<ApiResponse<IRefreshResponse>>("/auth/refresh-token");
        return response.data.data;
    },

    LogoutAction: async (): Promise<IUniversalMessageResponse> => {
        const response = await axiosInstance.post<ApiResponse<IUniversalMessageResponse>>("/auth/logout");
        return response.data.data;
    },

    ForgotPasswordAction: async (data:IForgotPasswordSchema): Promise<IUniversalMessageResponse> => {
        const response = await axiosInstance.post<ApiResponse<IUniversalMessageResponse>>("/auth/forgot-password", data);
        return response.data.data;
    },
    
    CheckVerificationCodeAction: async (data:ICheckVerificationCodeSchema): Promise<IUniversalMessageResponse> => {
        const response = await axiosInstance.post<ApiResponse<IUniversalMessageResponse>>("/auth/check-verification-code", data);
        return response.data.data;
    },

    ResetPasswordAction: async (data: IResetPasswordSchema): Promise<IUniversalMessageResponse> => {
        const response = await axiosInstance.post<ApiResponse<IUniversalMessageResponse>>("/auth/reset-password", data);
        return response.data.data;
    },

    ResendVerificationCodeAction: async (data: IResendVerificationCodeSchema): Promise<IUniversalMessageResponse> => {
        const response = await axiosInstance.post<ApiResponse<IUniversalMessageResponse>>("/auth/resend-verification-code", data);
        return response.data.data;
    },

    
}