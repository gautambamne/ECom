import axiosInstance from "@/lib/axios-interceptor";

export const SessionAction = {
    GetAllUserSessionAction: async(): Promise<ISessionResponse>=>{
        return (await(axiosInstance.get<ApiResponse<ISessionResponse>>("/session"))).data.data       
    },
    DeleteSessionAcceptCurrentAction: async(): Promise<IUniversalMessageResponse>=>{
        return (await(axiosInstance.delete<ApiResponse<IUniversalMessageResponse>>("/session"))).data.data       
    },
    DeleteSpecificSessionAction: async(session_id: string): Promise<IUniversalMessageResponse>=>{
        return (await(axiosInstance.get<ApiResponse<IUniversalMessageResponse>>(`/session/${session_id}`))).data.data       
    },
}