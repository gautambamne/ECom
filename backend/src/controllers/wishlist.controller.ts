import { type Request, type Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiResponse } from "../advices/ApiResponse";
import { ApiError } from "../advices/ApiError";
import { WishlistService } from "../services/wishlist.service";

// Helper function to sanitize wishlist data
const sanitizeWishlist = (wishlist: any) => {
    const { user, ...sanitizedWishlist } = wishlist;
    return {
        ...sanitizedWishlist,
        items: wishlist.items.map((item: any) => ({
            ...item,
            product: {
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                images: item.product.images,
                brand: item.product.brand,
                stock: item.product.stock
            }
        }))
    };
};

// Helper function to sanitize wishlist item data
const sanitizeWishlistItem = (wishlistItem: any) => {
    return {
        ...wishlistItem,
        product: {
            id: wishlistItem.product.id,
            name: wishlistItem.product.name,
            price: wishlistItem.product.price,
            images: wishlistItem.product.images,
            brand: wishlistItem.product.brand,
            stock: wishlistItem.product.stock
        }
    };
};

export const GetWishlistController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const wishlist = await WishlistService.getWishlist(userId);
    const sanitizedWishlist = sanitizeWishlist(wishlist);

    return res.status(200).json(
        new ApiResponse({
            wishlist: sanitizedWishlist,
            message: "Wishlist retrieved successfully"
        })
    );
});

export const AddToWishlistController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const wishlistItem = await WishlistService.addToWishlist(userId, req.body);
    const sanitizedWishlistItem = sanitizeWishlistItem(wishlistItem);

    return res.status(201).json(
        new ApiResponse({
            wishlistItem: sanitizedWishlistItem,
            message: "Product added to wishlist successfully"
        })
    );
});

export const RemoveFromWishlistController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const { productId } = req.params;
    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    await WishlistService.removeFromWishlist(userId, productId);

    return res.status(200).json(
        new ApiResponse({
            message: "Product removed from wishlist successfully"
        })
    );
});

export const CheckWishlistStatusController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const { productId } = req.params;
    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    const isInWishlist = await WishlistService.isInWishlist(userId, productId);

    return res.status(200).json(
        new ApiResponse({
            isInWishlist,
            message: "Wishlist status checked successfully"
        })
    );
});

export const ClearWishlistController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    await WishlistService.clearWishlist(userId);

    return res.status(200).json(
        new ApiResponse({
            message: "Wishlist cleared successfully"
        })
    );
});

export const GetWishlistItemCountController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const count = await WishlistService.getWishlistItemCount(userId);

    return res.status(200).json(
        new ApiResponse({
            count,
            message: "Wishlist item count retrieved successfully"
        })
    );
});