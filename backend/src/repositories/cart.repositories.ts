import { prisma } from "../db/connectDb";
import { type Cart, type CartItem, type Product } from "../generated/prisma";
import { RedisService } from "../services/redis.service";

export const CartRepository = {
    // Get or create cart for user
    getOrCreateCart: async (userId: string): Promise<Cart & { items: (CartItem & { product: Product & { categories: any[] } })[] }> => {
        const cacheKey = `cart:${userId}`;
        const cachedCart = await RedisService.getAndRefresh<Cart & { items: (CartItem & { product: Product & { categories: any[] } })[] }>(cacheKey);

        if (cachedCart) {
            return cachedCart;
        }

        let cart = await prisma.cart.findUnique({
            where: { user_id: userId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                categories: true
                            }
                        }
                    }
                }
            }
        });

        if (!cart) {
            // Generate a readable cart ID
            const cartId = `CART-${Math.random().toString(36).substring(2, 7).toUpperCase()}${Date.now().toString().slice(-3)}`;
            
            cart = await prisma.cart.create({
                data: { 
                    user_id: userId,
                    cart_id: cartId
                },
                include: {
                    items: {
                        include: {
                            product: {
                                include: {
                                    categories: true
                                }
                            }
                        }
                    }
                }
            });
        }

        await RedisService.set(cacheKey, cart); // Cache cart data
        return cart;
    },

    // Get product by ID for validation
    getProductById: async (productId: string): Promise<Product | null> => {
        return await prisma.product.findUnique({
            where: { id: productId },
            include: {
                categories: true
            }
        });
    },

    // Update cart summary
    updateCartSummary: async (cartId: string, summary: { subtotal: number; discount: number; tax: number; shipping_fee: number; total_amount: number; currency: string }) => {
        return await prisma.cart.update({
            where: { id: cartId },
            data: {
                subtotal: summary.subtotal,
                discount: summary.discount,
                tax: summary.tax,
                shipping_fee: summary.shipping_fee,
                total_amount: summary.total_amount,
                currency: summary.currency
            }
        });
    },

    // Add item to cart
    addItemToCart: async (userId: string, productId: string, quantity: number = 1): Promise<CartItem & { product: Product & { categories: any[] } }> => {
        // First get the product to calculate price
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { categories: true }
        });

        if (!product) {
            throw new Error("Product not found");
        }

        const price = product.discount_price || product.price;
        const total = price * quantity;

        // Get or create cart with items
        const cart = await CartRepository.getOrCreateCart(userId);

        // Check if item already exists in cart
        const existingItem = cart.items.find((item: any) => item.product_id === productId);

        if (existingItem) {
            // Update quantity and total
            const newQuantity = existingItem.quantity + quantity;
            const newTotal = price * newQuantity;
            
            const updatedItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { 
                    quantity: newQuantity,
                    price: price,
                    total: newTotal
                },
                include: {
                    product: {
                        include: {
                            categories: true
                        }
                    }
                }
            });

            // Invalidate cache
            await RedisService.delete(`cart:${userId}`);
            return updatedItem;
        } else {
            // Create new item
            const newItem = await prisma.cartItem.create({
                data: {
                    cart_id: cart.id,
                    product_id: productId,
                    quantity,
                    price,
                    total
                },
                include: {
                    product: {
                        include: {
                            categories: true
                        }
                    }
                }
            });

            // Invalidate cache
            await RedisService.delete(`cart:${userId}`);
            return newItem;
        }
    },

    // Get single cart item
    getCartItem: async (userId: string, itemId: string): Promise<CartItem & { product: Product & { categories: any[] } } | null> => {
        const item = await prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cart: { user_id: userId }
            },
            include: {
                product: {
                    include: {
                        categories: true
                    }
                }
            }
        });

        return item;
    },

    // Update cart item quantity
    updateCartItem: async (userId: string, itemId: string, quantity: number): Promise<CartItem & { product: Product & { categories: any[] } }> => {
        // Verify the item belongs to user's cart and get current item with product info
        const item = await prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cart: { user_id: userId }
            },
            include: {
                product: {
                    include: {
                        categories: true
                    }
                }
            }
        });

        if (!item) {
            throw new Error("Cart item not found");
        }

        // Calculate new price and total
        const price = item.product.discount_price || item.product.price;
        const total = price * quantity;

        const updatedItem = await prisma.cartItem.update({
            where: { id: itemId },
            data: { 
                quantity,
                price,
                total
            },
            include: {
                product: {
                    include: {
                        categories: true
                    }
                }
            }
        });

        // Invalidate cache
        await RedisService.delete(`cart:${userId}`);
        return updatedItem;
    },

    // Remove item from cart
    removeItemFromCart: async (userId: string, itemId: string): Promise<void> => {
        // Verify the item belongs to user's cart
        const item = await prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cart: { user_id: userId }
            }
        });

        if (!item) {
            throw new Error("Cart item not found");
        }

        await prisma.cartItem.delete({
            where: { id: itemId }
        });

        // Invalidate cache
        await RedisService.delete(`cart:${userId}`);
    },

    // Clear cart
    clearCart: async (userId: string): Promise<void> => {
        const cart = await prisma.cart.findUnique({
            where: { user_id: userId }
        });

        if (cart) {
            await prisma.cartItem.deleteMany({
                where: { cart_id: cart.id }
            });

            // Invalidate cache
            await RedisService.delete(`cart:${userId}`);
        }
    },

    // Get cart item count
    getCartItemCount: async (userId: string): Promise<number> => {
        const cart = await CartRepository.getOrCreateCart(userId);
        if (!cart) return 0;
        return cart.items.reduce((total: number, item: CartItem) => total + item.quantity, 0);
    }
};