import { CartRepository } from "../repositories/cart.repositories";
import { ApiError } from "../advices/ApiError";
import { AddToCartSchema, UpdateCartItemSchema } from "../schema/cart.schema";
import type { z } from "zod";
import { zodErrorFormatter } from "../utils/format-validation-error";

interface CartSummary {
    subtotal: number;
    discount: number;
    tax: number;
    shipping_fee: number;
    total_amount: number;
    currency: string;
}

interface ProductForCart {
    id: string;
    name: string;
    price: number;
    discount_price?: number | null;
    stock: number;
    images: string[];
    brand?: string | null;
    categories: { name: string }[];
    is_active: boolean;
}

interface CartItemWithProduct {
    product_id: number;
    name: string;
    category: string;
    image_url: string;
    price: number;
    quantity: number;
    total: number;
    in_stock: boolean;
}

interface FormattedCart {
    user_id: number;
    cart_id: string;
    items: CartItemWithProduct[];
    summary: CartSummary;
    updated_at: string;
}

export const CartService = {
    // Calculate cart summary with tax and shipping
    calculateCartSummary(items: any[], currency: string = "INR"): CartSummary {
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        
        // Calculate discount (you can implement your discount logic here)
        const discount = items.reduce((sum, item) => {
            if (item.product?.discount_price && item.product.discount_price < item.product.price) {
                const discountPerItem = item.product.price - item.product.discount_price;
                return sum + (discountPerItem * item.quantity);
            }
            return sum;
        }, 0);
        
        // Calculate tax (4.5% for example - adjust based on your business logic)
        const taxRate = 0.045;
        const taxableAmount = subtotal - discount;
        const tax = Math.round(taxableAmount * taxRate * 100) / 100;
        
        // Calculate shipping (free shipping over ₹500, otherwise ₹50)
        const shipping_fee = subtotal >= 500 ? 0 : 50;
        
        const total_amount = subtotal - discount + tax + shipping_fee;
        
        return {
            subtotal: Math.round(subtotal * 100) / 100,
            discount: Math.round(discount * 100) / 100,
            tax,
            shipping_fee,
            total_amount: Math.round(total_amount * 100) / 100,
            currency
        };
    },

    // Format cart for API response
    formatCartResponse(cart: any): FormattedCart {
        const formattedItems: CartItemWithProduct[] = cart.items.map((item: any) => ({
            product_id: Math.abs(item.product.id.split('-').join('').slice(0, 8).split('').reduce((a: number, b: string) => ((a << 5) - a) + b.charCodeAt(0), 0)),
            name: item.product.name,
            category: item.product.categories[0]?.name || "Uncategorized",
            image_url: item.product.images[0] || "",
            price: item.price,
            quantity: item.quantity,
            total: item.total,
            in_stock: item.product.stock > 0 && item.product.is_active
        }));

        const summary = this.calculateCartSummary(cart.items, cart.currency);

        return {
            user_id: Math.abs(cart.user_id.split('-').join('').slice(0, 8).split('').reduce((a: number, b: string) => ((a << 5) - a) + b.charCodeAt(0), 0)),
            cart_id: cart.cart_id,
            items: formattedItems,
            summary,
            updated_at: cart.updated_at.toISOString()
        };
    },

    // Get user's cart with production-ready format
    async getCart(userId: string): Promise<FormattedCart> {
        try {
            const cart = await CartRepository.getOrCreateCart(userId);
            
            // Update cart summary in database
            const summary = this.calculateCartSummary(cart.items, cart.currency);
            await CartRepository.updateCartSummary(cart.id, summary);
            
            // Return formatted response
            const updatedCart = { ...cart, ...summary };
            return this.formatCartResponse(updatedCart);
        } catch (error) {
            throw new ApiError(500, "Failed to get cart");
        }
    },

    // Add item to cart with stock validation
    async addToCart(userId: string, input: z.infer<typeof AddToCartSchema>) {
        // Validate input
        const result = AddToCartSchema.safeParse(input);
        if (!result.success) {
            throw new ApiError(400, "Validation failed", zodErrorFormatter(result.error));
        }

        try {
            // Check product availability first
            const product = await CartRepository.getProductById(result.data.productId);
            if (!product) {
                throw new ApiError(404, "Product not found");
            }
            
            if (!product.is_active) {
                throw new ApiError(400, "Product is not available");
            }
            
            if (product.stock < result.data.quantity) {
                throw new ApiError(400, `Only ${product.stock} items available in stock`);
            }

            const cartItem = await CartRepository.addItemToCart(
                userId,
                result.data.productId,
                result.data.quantity
            );
            
            return cartItem;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError(500, "Failed to add item to cart");
        }
    },

    // Update cart item quantity with stock validation
    async updateCartItem(userId: string, itemId: string, input: z.infer<typeof UpdateCartItemSchema>) {
        // Validate input
        const result = UpdateCartItemSchema.safeParse(input);
        if (!result.success) {
            throw new ApiError(400, "Validation failed", zodErrorFormatter(result.error));
        }

        try {
            // Get current cart item to validate stock
            const currentItem = await CartRepository.getCartItem(userId, itemId);
            if (!currentItem) {
                throw new ApiError(404, "Cart item not found");
            }

            // Check stock availability
            const product = await CartRepository.getProductById(currentItem.product_id);
            if (!product) {
                throw new ApiError(404, "Product not found");
            }
            
            if (product.stock < result.data.quantity) {
                throw new ApiError(400, `Only ${product.stock} items available in stock`);
            }

            const updatedItem = await CartRepository.updateCartItem(
                userId,
                itemId,
                result.data.quantity
            );
            
            return updatedItem;
        } catch (error: any) {
            if (error instanceof ApiError) {
                throw error;
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
    },

    // Validate cart items before checkout
    async validateCartForCheckout(userId: string): Promise<{ valid: boolean; issues: string[] }> {
        try {
            const cart = await CartRepository.getOrCreateCart(userId);
            const issues: string[] = [];
            
            for (const item of cart.items) {
                const product = await CartRepository.getProductById(item.product_id);
                
                if (!product) {
                    issues.push(`Product ${item.product.name} is no longer available`);
                    continue;
                }
                
                if (!product.is_active) {
                    issues.push(`Product ${product.name} is currently unavailable`);
                    continue;
                }
                
                if (product.stock < item.quantity) {
                    issues.push(`Only ${product.stock} units of ${product.name} available, but ${item.quantity} requested`);
                }
            }
            
            return {
                valid: issues.length === 0,
                issues
            };
        } catch (error) {
            throw new ApiError(500, "Failed to validate cart");
        }
    }
};