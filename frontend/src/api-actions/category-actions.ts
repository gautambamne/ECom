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
    CreateCategoryAction: async (data: ICreateCategorySchema, image?: File): Promise<ICreateCategoryResponse> => {
        const formData = new FormData();
        
        // Append all category data
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                formData.append(key, value.toString());
            }
        });

        // Append image file if provided
        if (image) {
            formData.append('image', image);
        }

        const response = await axiosInstance.post<ApiResponse<ICreateCategoryResponse>>("/categories", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    UpdateCategoryAction: async (categoryId: string, data: IUpdateCategorySchema, image?: File): Promise<IUpdateCategoryResponse> => {
        const formData = new FormData();
        
        // Append all category data
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                formData.append(key, value.toString());
            }
        });

        // Append image file if provided
        if (image) {
            formData.append('image', image);
        }

        const response = await axiosInstance.put<ApiResponse<IUpdateCategoryResponse>>(`/categories/${categoryId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    DeleteCategoryAction: async (categoryId: string): Promise<IUniversalMessageResponse> => {
        const response = await axiosInstance.delete<ApiResponse<IUniversalMessageResponse>>(`/categories/${categoryId}`);
        return response.data.data;
    },
};