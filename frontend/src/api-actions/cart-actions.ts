import axiosInstance from "@/lib/axios-interceptor";
import { IAddToCartSchema, IUpdateCartItemSchema } from "@/schema/cart-schema";

export const CartActions = {
    GetUserCartAction: async (): Promise<IGetUserCartResponse>=>{
        const response = await axiosInstance.get<ApiResponse<IGetUserCartResponse>>("/cart")
        return response.data.data
    },

    AddItemCartAction: async (data:IAddToCartSchema): Promise<IGetUserCartResponse>=>{
        const response = await axiosInstance.post<ApiResponse<IGetUserCartResponse>>("/cart",data)
        return response.data.data
    },

    UpdateCartItemQuantityAction: async (data:IUpdateCartItemSchema, itemId: string): Promise<IUpdateCartItemQuantityResponse>=>{
        const response = await axiosInstance.put<ApiResponse<IUpdateCartItemQuantityResponse>>(`/cart/items/${itemId}`,data)
        return response.data.data
    },

    GetSingleCartItemAction: async (itemId: string): Promise<IGetSingleCartResponse>=>{
        const response = await axiosInstance.get<ApiResponse<IGetSingleCartResponse>>(`/cart/items/${itemId}`)
        return response.data.data
    },
    
    GetCartItemCountAction: async (): Promise<IGetCartItemCountResponse>=>{
        const response = await axiosInstance.get<ApiResponse<IGetCartItemCountResponse>>("/cart/count")
        return response.data.data
    },

    ClearCartAction: async (): Promise<IUniversalMessageResponse>=>{
        const response = await axiosInstance.delete<ApiResponse<IUniversalMessageResponse>>("/cart")
        return response.data.data
    },

    RemoveItemFromCartAction: async (itemId: string): Promise<IUniversalMessageResponse>=>{
        const response = await axiosInstance.delete<ApiResponse<IUniversalMessageResponse>>(`/cart/items/${itemId}`)
        return response.data.data
    },


}