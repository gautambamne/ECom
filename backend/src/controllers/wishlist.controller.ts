import { type Request, type Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiResponse } from "../advices/ApiResponse";
import { ApiError } from "../advices/ApiError";
import { WishlistService } from "../services/wishlist.service";


export const GetWishlistController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const wishlistData = await WishlistService.getWishlist(userId);

    return res.status(200).json({
        success: true,
        message: "Wishlist fetched successfully",
        data: wishlistData
    });
});


export const AddToWishlistController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const wishlistItem = await WishlistService.addToWishlist(userId, req.body);

    return res.status(201).json({
        success: true,
        message: "Product added to wishlist successfully",
        data: {
            wishlistItem: {
                id: wishlistItem.id,
                product_id: wishlistItem.product_id,
                price: wishlistItem.price,
                discount_price: wishlistItem.discount_price,
                currency: wishlistItem.currency,
                added_at: wishlistItem.added_at
            }
        }
    });
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

    return res.status(200).json({
        success: true,
        message: "Product removed from wishlist successfully"
    });
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

    return res.status(200).json({
        success: true,
        message: "Wishlist status checked successfully",
        data: { isInWishlist }
    });
});


export const ClearWishlistController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    await WishlistService.clearWishlist(userId);

    return res.status(200).json({
        success: true,
        message: "Wishlist cleared successfully"
    });
});


export const GetWishlistItemCountController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const count = await WishlistService.getWishlistItemCount(userId);

    return res.status(200).json({
        success: true,
        message: "Wishlist item count retrieved successfully",
        data: { count }
    });
});


// New controller for moving wishlist item to cart
export const MoveToCartController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const { productId } = req.params;
    const { quantity = 1 } = req.body;

    if (!productId) {
        throw new ApiError(400, "Product ID is required");
    }

    const result = await WishlistService.moveToCart(userId, productId, quantity);

    return res.status(200).json({
        success: true,
        message: result.message,
        data: { productId: result.productId }
    });
});
