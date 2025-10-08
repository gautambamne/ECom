import axiosInstance from "@/lib/axios-interceptor";
import { ICreateProductSchema, IUpdateProductSchema, IProductsQuerySchema } from "@/schema/product-schema";

export const ProductActions = {
    // Public routes
    GetProductsAction: async (query?: IProductsQuerySchema): Promise<IGetProductsResponse> => {
        const params = new URLSearchParams();
        if (query) {
            Object.entries(query).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, value.toString());
                }
            });
        }
        const response = await axiosInstance.get<ApiResponse<IGetProductsResponse>>(`/products/search?${params.toString()}`);
        return response.data.data;
    },

    GetProductsByCategoryAction: async (categoryId: string, query?: IProductsQuerySchema): Promise<IGetProductsResponse> => {
        const params = new URLSearchParams();
        if (query) {
            Object.entries(query).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, value.toString());
                }
            });
        }
        const response = await axiosInstance.get<ApiResponse<IGetProductsResponse>>(`/products/categories/${categoryId}?${params.toString()}`);
        return response.data.data;
    },

    GetProductAction: async (productId: string): Promise<IGetProductResponse> => {
        const response = await axiosInstance.get<ApiResponse<IGetProductResponse>>(`/products/${productId}`);
        return response.data.data;
    },

    GetFeaturedProductsAction: async (): Promise<IGetProductsResponse> => {
        const response = await axiosInstance.get<ApiResponse<IGetProductsResponse>>("/products/featured");
        return response.data.data;
    },

    GetProductsOnSaleAction: async (): Promise<IGetProductsResponse> => {
        const response = await axiosInstance.get<ApiResponse<IGetProductsResponse>>("/products/on-sale");
        return response.data.data;
    },

    // Vendor routes (require authentication and vendor role)
    CreateProductAction: async (data: ICreateProductSchema, image?: File): Promise<ICreateProductResponse> => {
        const formData = new FormData();
        
        // Append all product data
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value.toString());
                }
            }
        });

        // Append image file if provided
        if (image) {
            formData.append('image', image);
        }

        const response = await axiosInstance.post<ApiResponse<ICreateProductResponse>>("/products", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    UpdateProductAction: async (productId: string, data: IUpdateProductSchema, image?: File): Promise<IUpdateProductResponse> => {
        const formData = new FormData();
        
        // Append all product data
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value.toString());
                }
            }
        });

        // Append image file if provided
        if (image) {
            formData.append('image', image);
        }

        const response = await axiosInstance.put<ApiResponse<IUpdateProductResponse>>(`/products/${productId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.data;
    },

    DeleteProductAction: async (productId: string): Promise<IUniversalMessageResponse> => {
        const response = await axiosInstance.delete<ApiResponse<IUniversalMessageResponse>>(`/products/${productId}`);
        return response.data.data;
    },

    GetVendorProductsAction: async (vendorId?: string): Promise<IGetProductsResponse> => {
        const endpoint = vendorId ? `/products/vendor/${vendorId}` : "/products/vendor/me";
        const response = await axiosInstance.get<ApiResponse<IGetProductsResponse>>(endpoint);
        return response.data.data;
    },
};