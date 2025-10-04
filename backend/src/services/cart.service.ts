import { CartRepository } from "../repositories/cart.repositories";
import { ApiError } from "../advices/ApiError";
import { AddToCartSchema, UpdateCartItemSchema } from "../schema/cart.schema";
import type { z } from "zod";
import { zodErrorFormatter } from "../utils/format-validation-error";

export const CartService = {
    // Get user's cart
    async getCart(userId: string) {
        try {
            const cart = await CartRepository.getOrCreateCart(userId);
            return cart;
        } catch (error) {
            throw new ApiError(500, "Failed to get cart");
        }
    },

    // Add item to cart
    async addToCart(userId: string, input: z.infer<typeof AddToCartSchema>) {
        // Validate input
        const result = AddToCartSchema.safeParse(input);
        if (!result.success) {
            throw new ApiError(400, "Validation failed", zodErrorFormatter(result.error));
        }

        try {
            const cartItem = await CartRepository.addItemToCart(
                userId,
                result.data.productId,
                result.data.quantity
            );
            return cartItem;
        } catch (error: any) {
            if (error.message === "Cart item not found") {
                throw new ApiError(404, error.message);
            }
            throw new ApiError(500, "Failed to add item to cart");
        }
    },

    // Update cart item quantity
    async updateCartItem(userId: string, itemId: string, input: z.infer<typeof UpdateCartItemSchema>) {
        // Validate input
        const result = UpdateCartItemSchema.safeParse(input);
        if (!result.success) {
            throw new ApiError(400, "Validation failed", zodErrorFormatter(result.error));
        }

        try {
            const updatedItem = await CartRepository.updateCartItem(
                userId,
                itemId,
                result.data.quantity
            );
            return updatedItem;
        } catch (error: any) {
            if (error.message === "Cart item not found") {
                throw new ApiError(404, error.message);
            }
            throw new ApiError(500, "Failed to update cart item");
        }
    },

    // Get single cart item
    async getCartItem(userId: string, itemId: string) {
        try {
            const cartItem = await CartRepository.getCartItem(userId, itemId);
            return cartItem;
        } catch (error: any) {
            if (error.message === "Cart item not found") {
                throw new ApiError(404, error.message);
            }
            throw new ApiError(500, "Failed to get cart item");
        }
    },

    // Remove item from cart
    async removeFromCart(userId: string, itemId: string) {
        try {
            await CartRepository.removeItemFromCart(userId, itemId);
        } catch (error: any) {
            if (error.message === "Cart item not found") {
                throw new ApiError(404, error.message);
            }
            throw new ApiError(500, "Failed to remove item from cart");
        }
    },

    // Clear cart
    async clearCart(userId: string) {
        try {
            await CartRepository.clearCart(userId);
        } catch (error) {
            throw new ApiError(500, "Failed to clear cart");
        }
    },

    // Get cart item count
    async getCartItemCount(userId: string): Promise<number> {
        try {
            return await CartRepository.getCartItemCount(userId);
        } catch (error) {
            throw new ApiError(500, "Failed to get cart item count");
        }
    }
};