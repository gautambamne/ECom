import { type Request, type Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiResponse } from "../advices/ApiResponse";
import { ApiError } from "../advices/ApiError";
import { CartService } from "../services/cart.service";


export const GetCartController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const cartData = await CartService.getCart(userId);

    return res.status(200).json({
        success: true,
        message: "Cart fetched successfully",
        data: cartData
    });
});


export const AddToCartController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const cartItem = await CartService.addToCart(userId, req.body);

    return res.status(201).json({
        success: true,
        message: "Item added to cart successfully",
        data: {
            cartItem: {
                id: cartItem.id,
                product_id: cartItem.product_id,
                quantity: cartItem.quantity,
                price: cartItem.price,
                total: cartItem.total
            }
        }
    });
});


export const UpdateCartItemController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const { itemId } = req.params;
    if (!itemId) {
        throw new ApiError(400, "Item ID is required");
    }

    const updatedItem = await CartService.updateCartItem(userId, itemId, req.body);

    return res.status(200).json({
        success: true,
        message: "Cart item updated successfully",
        data: {
            cartItem: {
                id: updatedItem.id,
                product_id: updatedItem.product_id,
                quantity: updatedItem.quantity,
                price: updatedItem.price,
                total: updatedItem.total
            }
        }
    });
});


export const GetCartItemController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const { itemId } = req.params;
    if (!itemId) {
        throw new ApiError(400, "Item ID is required");
    }

    const cartItem = await CartService.getCartItem(userId, itemId);

    return res.status(200).json(
        new ApiResponse({
            cartItem,
            message: "Cart item retrieved successfully"
        })
    );
});


export const RemoveFromCartController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const { itemId } = req.params;
    if (!itemId) {
        throw new ApiError(400, "Item ID is required");
    }

    await CartService.removeFromCart(userId, itemId);

    return res.status(200).json({
        success: true,
        message: "Item removed from cart successfully"
    });
});


export const ClearCartController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    await CartService.clearCart(userId);

    return res.status(200).json({
        success: true,
        message: "Cart cleared successfully"
    });
});


export const GetCartItemCountController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const count = await CartService.getCartItemCount(userId);

    return res.status(200).json({
        success: true,
        message: "Cart item count retrieved successfully",
        data: { count }
    });
});


// New controller for cart validation before checkout
export const ValidateCartController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const validation = await CartService.validateCartForCheckout(userId);

    return res.status(200).json({
        success: true,
        message: validation.valid ? "Cart is valid for checkout" : "Cart has validation issues",
        data: validation
    });
});
