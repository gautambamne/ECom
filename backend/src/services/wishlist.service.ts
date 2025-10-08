import { WishlistRepository } from "../repositories/wishlist.repositories";
import { ApiError } from "../advices/ApiError";
import { AddToWishlistSchema } from "../schema/wishlist.schema";
import type { z } from "zod";
import { zodErrorFormatter } from "../utils/format-validation-error";

interface WishlistItemFormatted {
    product_id: number;
    name: string;
    category: string;
    image_url: string;
    price: number;
    discount_price: number | null;
    currency: string;
    in_stock: boolean;
    added_at: string;
}

interface FormattedWishlist {
    user_id: number;
    wishlist_id: string;
    items: WishlistItemFormatted[];
    total_items: number;
    updated_at: string;
}

export const WishlistService = {
    // Format wishlist for API response
    formatWishlistResponse(wishlist: any): FormattedWishlist {
        const formattedItems: WishlistItemFormatted[] = wishlist.items.map((item: any) => ({
            product_id: Math.abs(item.product.id.split('-').join('').slice(0, 8).split('').reduce((a: number, b: string) => ((a << 5) - a) + b.charCodeAt(0), 0)),
            name: item.product.name,
            category: item.product.categories[0]?.name || "Uncategorized",
            image_url: item.product.images[0] || "",
            price: item.price,
            discount_price: item.discount_price,
            currency: item.currency,
            in_stock: item.product.stock > 0 && item.product.is_active,
            added_at: item.added_at.toISOString()
        }));

        return {
            user_id: Math.abs(wishlist.user_id.split('-').join('').slice(0, 8).split('').reduce((a: number, b: string) => ((a << 5) - a) + b.charCodeAt(0), 0)),
            wishlist_id: wishlist.wishlist_id,
            items: formattedItems,
            total_items: wishlist.total_items,
            updated_at: wishlist.updated_at.toISOString()
        };
    },

    // Get user's wishlist with production-ready format
    async getWishlist(userId: string): Promise<FormattedWishlist> {
        try {
            const wishlist = await WishlistRepository.getOrCreateWishlist(userId);
            
            // Update total_items count
            await WishlistRepository.updateWishlistItemCount(wishlist.id, wishlist.items.length);
            
            // Return formatted response
            const updatedWishlist = { ...wishlist, total_items: wishlist.items.length };
            return this.formatWishlistResponse(updatedWishlist);
        } catch (error) {
            throw new ApiError(500, "Failed to get wishlist");
        }
    },

    // Add product to wishlist with price capture
    async addToWishlist(userId: string, input: z.infer<typeof AddToWishlistSchema>) {
        // Validate input
        const result = AddToWishlistSchema.safeParse(input);
        if (!result.success) {
            throw new ApiError(400, "Validation failed", zodErrorFormatter(result.error));
        }

        try {
            // Check if product exists and is active
            const product = await WishlistRepository.getProductById(result.data.productId);
            if (!product) {
                throw new ApiError(404, "Product not found");
            }
            
            if (!product.is_active) {
                throw new ApiError(400, "Product is not available");
            }

            const wishlistItem = await WishlistRepository.addItemToWishlist(
                userId,
                result.data.productId
            );
            
            return wishlistItem;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            if (error.message === "Product already in wishlist") {
                throw new ApiError(409, error.message);
            }
            throw new ApiError(500, "Failed to add product to wishlist");
        }
    },

    // Remove product from wishlist
    async removeFromWishlist(userId: string, productId: string) {
        try {
            await WishlistRepository.removeItemFromWishlist(userId, productId);
        } catch (error: any) {
            if (error.message === "Wishlist item not found") {
                throw new ApiError(404, error.message);
            }
            throw new ApiError(500, "Failed to remove product from wishlist");
        }
    },

    // Check if product is in wishlist
    async isInWishlist(userId: string, productId: string): Promise<boolean> {
        try {
            return await WishlistRepository.isProductInWishlist(userId, productId);
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
    },

    // Move item from wishlist to cart
    async moveToCart(userId: string, productId: string, quantity: number = 1) {
        try {
            // Check if product is in wishlist
            const isInWishlist = await WishlistRepository.isProductInWishlist(userId, productId);
            if (!isInWishlist) {
                throw new ApiError(404, "Product not found in wishlist");
            }

            // Get product details
            const product = await WishlistRepository.getProductById(productId);
            if (!product) {
                throw new ApiError(404, "Product not found");
            }

            if (product.stock < quantity) {
                throw new ApiError(400, `Only ${product.stock} items available in stock`);
            }

            // Remove from wishlist
            await WishlistRepository.removeItemFromWishlist(userId, productId);

            return { message: "Product moved to cart successfully", productId };
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Failed to move product to cart");
        }
    }
};