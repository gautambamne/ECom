import { type Request, type Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiResponse } from "../advices/ApiResponse";
import { ApiError } from "../advices/ApiError";
import { CartService } from "../services/cart.service";

// Helper function to sanitize cart data
const sanitizeCart = (cart: any) => {
    const { user, ...sanitizedCart } = cart;
    return {
        ...sanitizedCart,
        items: cart.items.map((item: any) => ({
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

export const GetCartController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const cart = await CartService.getCart(userId);
    const sanitizedCart = sanitizeCart(cart);

    return res.status(200).json(
        new ApiResponse({
            cart: sanitizedCart,
            message: "Cart retrieved successfully"
        })
    );
});

export const AddToCartController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const cartItem = await CartService.addToCart(userId, req.body);

    return res.status(201).json(
        new ApiResponse({
            cartItem,
            message: "Item added to cart successfully"
        })
    );
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

    return res.status(200).json(
        new ApiResponse({
            cartItem: updatedItem,
            message: "Cart item updated successfully"
        })
    );
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

    return res.status(200).json(
        new ApiResponse({
            message: "Item removed from cart successfully"
        })
    );
});

export const ClearCartController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    await CartService.clearCart(userId);

    return res.status(200).json(
        new ApiResponse({
            message: "Cart cleared successfully"
        })
    );
});

export const GetCartItemCountController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new ApiError(401, "User not authenticated");
    }

    const count = await CartService.getCartItemCount(userId);

    return res.status(200).json(
        new ApiResponse({
            count,
            message: "Cart item count retrieved successfully"
        })
    );
});