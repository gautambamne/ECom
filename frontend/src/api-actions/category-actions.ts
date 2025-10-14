import axiosInstance from "@/lib/axios-interceptor";
import { ICreateCategorySchema, IUpdateCategorySchema } from "@/schema/category.schema";

export const CategoryActions = {
    // Public routes
    GetCategoriesAction: async (): Promise<IGetCategoriesResponse> => {
        const response = await axiosInstance.get<ApiResponse<IGetCategoriesResponse>>("/categories");
        return response.data.data;
    },

    GetCategoryByIdAction: async (categoryId: string): Promise<IGetCategoryResponse> => {
        const response = await axiosInstance.get<ApiResponse<IGetCategoryResponse>>(`/categories/${categoryId}`);
        return response.data.data;
    },

    // Admin/Vendor routes (require authentication and appropriate role)
    CreateCategoryAction: async (data: ICreateCategorySchema): Promise<ICreateCategoryResponse> => {
        const response = await axiosInstance.post<ApiResponse<ICreateCategoryResponse>>("/categories", data);
        return response.data.data;
    },

    UpdateCategoryAction: async (categoryId: string, data: IUpdateCategorySchema): Promise<IUpdateCategoryResponse> => {
        const response = await axiosInstance.patch<ApiResponse<IUpdateCategoryResponse>>(`/categories/${categoryId}`, data);
        return response.data.data;
    },

    DeleteCategoryAction: async (categoryId: string): Promise<IUniversalMessageResponse> => {
        const response = await axiosInstance.delete<ApiResponse<IUniversalMessageResponse>>(`/categories/${categoryId}`);
        return response.data.data;
    },
};