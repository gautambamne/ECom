import { WishlistRepository } from "../repositories/wishlist.repositories";
import { ApiError } from "../advices/ApiError";
import { AddToWishlistSchema } from "../schema/wishlist.schema";
import type { z } from "zod";

export const WishlistService = {
    // Get user's wishlist
    async getWishlist(userId: string) {
        try {
            const wishlist = await WishlistRepository.getOrCreateWishlist(userId);
            return wishlist;
        } catch (error) {
            throw new ApiError(500, "Failed to get wishlist");
        }
    },

    // Add product to wishlist
    async addToWishlist(userId: string, input: z.infer<typeof AddToWishlistSchema>) {
        // Validate input
        const result = AddToWishlistSchema.safeParse(input);
        if (!result.success) {
            throw new ApiError(400, "Validation failed",
                Object.fromEntries(
                    Object.entries(result.error.flatten().fieldErrors)
                    .map(([key, errors]) => [key, errors?.join(", ") || "Invalid input"])
                )
            );
        }

        try {
            const wishlistItem = await WishlistRepository.addToWishlist(
                userId,
                result.data.productId
            );
            return wishlistItem;
        } catch (error: any) {
            if (error.message === "Product already in wishlist") {
                throw new ApiError(409, error.message);
            }
            throw new ApiError(500, "Failed to add product to wishlist");
        }
    },

    // Remove product from wishlist
    async removeFromWishlist(userId: string, productId: string) {
        try {
            await WishlistRepository.removeFromWishlist(userId, productId);
        } catch (error: any) {
            if (error.message === "Wishlist not found" || error.message === "Product not in wishlist") {
                throw new ApiError(404, error.message);
            }
            throw new ApiError(500, "Failed to remove product from wishlist");
        }
    },

    // Check if product is in wishlist
    async isInWishlist(userId: string, productId: string): Promise<boolean> {
        try {
            return await WishlistRepository.isInWishlist(userId, productId);
        } catch (error) {
            throw new ApiError(500, "Failed to check wishlist status");
        }
    },

    // Clear wishlist
    async clearWishlist(userId: string) {
        try {
            await WishlistRepository.clearWishlist(userId);
        } catch (error) {
            throw new ApiError(500, "Failed to clear wishlist");
        }
    },

    // Get wishlist item count
    async getWishlistItemCount(userId: string): Promise<number> {
        try {
            return await WishlistRepository.getWishlistItemCount(userId);
        } catch (error) {
            throw new ApiError(500, "Failed to get wishlist item count");
        }
    }
};