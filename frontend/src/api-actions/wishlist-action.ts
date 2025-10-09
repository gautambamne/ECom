import axiosInstance from "@/lib/axios-interceptor";
import { IAddToWishlistSchema } from "@/schema/wishlist.schema";

export const WishlistActions = {
    GetUserWishlistAction: async (): Promise<IGetUserWishlistResponse> => {
        const response = await axiosInstance.get<ApiResponse<IGetUserWishlistResponse>>("/wishlist");
        return response.data.data;
    },

    AddItemToWishlistAction: async (data: IAddToWishlistSchema): Promise<IAddItemToWishlistResponse> => {
        const response = await axiosInstance.post<ApiResponse<IAddItemToWishlistResponse>>("/wishlist/items", data);
        return response.data.data;
    },

    CheckWishlistStatusAction: async (productId: string): Promise<ICheckWishlistStatusResponse> => {
        const response = await axiosInstance.get<ApiResponse<ICheckWishlistStatusResponse>>(`/wishlist/status/${productId}`);
        return response.data.data;
    },

    GetWishlistItemCountAction: async (): Promise<IGetWishlistItemCountResponse> => {
        const response = await axiosInstance.get<ApiResponse<IGetWishlistItemCountResponse>>("/wishlist/count");
        return response.data.data;
    },

    ClearWishlistAction: async (): Promise<IUniversalMessageResponse> => {
        const response = await axiosInstance.delete<ApiResponse<IUniversalMessageResponse>>("/wishlist");
        return response.data.data;
    },

    RemoveItemFromWishlistAction: async (productId: string): Promise<IUniversalMessageResponse> => {
        const response = await axiosInstance.delete<ApiResponse<IUniversalMessageResponse>>(`/wishlist/items/${productId}`);
        return response.data.data;
    },

    MoveToCartAction: async (productId: string): Promise<IUniversalMessageResponse> => {
        const response = await axiosInstance.post<ApiResponse<IUniversalMessageResponse>>(`/wishlist/move-to-cart/${productId}`);
        return response.data.data;
    },
};