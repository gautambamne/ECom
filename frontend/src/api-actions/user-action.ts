import axiosInstance from "@/lib/axios-interceptor";
import { IUpdatePasswordSchema, IUpdateProfileSchema } from "@/schema/user-schema";

export const UserAction = {
    GetCurrentUser: async () : Promise<IUser> => {
        return (await axiosInstance.get<ApiResponse<IUser>>("/users/me")).data.data;
    },

    UpdateProfileUser: async (data: IUpdateProfileSchema) : Promise<IUser> => {
        const response = await axiosInstance.put<ApiResponse<IUser>>("/users/update", data)
        return response.data.data;
    },

    UpdatePasswordUser: async (data: IUpdatePasswordSchema) : Promise<IUniversalMessageResponse> => {
        const response = await axiosInstance.put<ApiResponse<IUniversalMessageResponse>>("/users/update-password", data)
        return response.data.data;
    },
}