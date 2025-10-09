import axiosInstance from "@/lib/axios-interceptor";
import { IUpdateUserSchema, IPasswordChangeSchema } from "@/schema/user.schema";

export const UserActions = {
    GetCurrentUserAction: async (): Promise<IGetUserResponse> => {
        const response = await axiosInstance.get<ApiResponse<IGetUserResponse>>("/users/me");
        return response.data.data;
    },

    UpdateUserAction: async (data: IUpdateUserSchema): Promise<IUpdateUserResponse> => {
        const response = await axiosInstance.put<ApiResponse<IUpdateUserResponse>>("/users/me", data);
        return response.data.data;
    },

    UpdatePasswordAction: async (data: IPasswordChangeSchema): Promise<IUniversalMessageResponse> => {
        const response = await axiosInstance.put<ApiResponse<IUniversalMessageResponse>>("/users/me/password", data);
        return response.data.data;
    },
};