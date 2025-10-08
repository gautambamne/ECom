import axiosInstance from "@/lib/axios-interceptor";

export const SessionActions = {
    GetAllUserSessionsAction: async(): Promise<ISessionResponse> => {
        const response = await axiosInstance.get<ApiResponse<ISessionResponse>>("/session");
        return response.data.data;       
    },
    
    DeleteAllSessionsExceptCurrentAction: async(): Promise<IUniversalMessageResponse> => {
        const response = await axiosInstance.delete<ApiResponse<IUniversalMessageResponse>>("/session");
        return response.data.data;       
    },
    
    DeleteSpecificSessionAction: async(sessionId: string): Promise<IUniversalMessageResponse> => {
        const response = await axiosInstance.delete<ApiResponse<IUniversalMessageResponse>>(`/session/${sessionId}`);
        return response.data.data;       
    },
};