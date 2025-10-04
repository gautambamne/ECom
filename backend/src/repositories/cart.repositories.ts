import { prisma } from "../db/connectDb";
import { type Cart, type CartItem } from "../generated/prisma";
import { RedisService } from "../services/redis.service";

export const CartRepository = {
    // Get or create cart for user
    getOrCreateCart: async (userId: string): Promise<Cart & { items: CartItem[] }> => {
        const cacheKey = `cart:${userId}`;
        const cachedCart = await RedisService.getAndRefresh<Cart & { items: CartItem[] }>(cacheKey);

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
                                vendor: true,
                                variants: true,
                                categories: true
                            }
                        }
                    }
                }
            }
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { user_id: userId },
                include: {
                    items: {
                        include: {
                            product: {
                                include: {
                                    vendor: true,
                                    variants: true,
                                    categories: true
                                }
                            }
                        }
                    }
                }
            });
        }

        await RedisService.set(cacheKey, cart);
        return cart;
    },

    // Add item to cart
    addItemToCart: async (userId: string, productId: string, quantity: number = 1): Promise<CartItem> => {
        // Get or create cart with items
        const cart = await prisma.cart.findUnique({
            where: { user_id: userId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                vendor: true,
                                variants: true,
                                categories: true
                            }
                        }
                    }
                }
            }
        });

        if (!cart) {
            // Create cart and add item
            const newCart = await prisma.cart.create({
                data: {
                    user_id: userId,
                    items: {
                        create: {
                            product_id: productId,
                            quantity
                        }
                    }
                },
                include: {
                    items: {
                        include: {
                            product: {
                                include: {
                                    vendor: true,
                                    variants: true,
                                    categories: true
                                }
                            }
                        }
                    }
                }
            });

            // Invalidate cache
            await RedisService.delete(`cart:${userId}`);
            return newCart.items[0]!;
        }

        // Check if item already exists in cart
        const existingItem = cart.items.find((item: CartItem) => item.product_id === productId);

        if (existingItem) {
            // Update quantity
            const updatedItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity },
                include: {
                    product: {
                        include: {
                            vendor: true,
                            variants: true,
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
                    quantity
                },
                include: {
                    product: {
                        include: {
                            vendor: true,
                            variants: true,
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
    getCartItem: async (userId: string, itemId: string): Promise<CartItem> => {
        const item = await prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cart: { user_id: userId }
            },
            include: {
                product: {
                    include: {
                        vendor: true,
                        variants: true,
                        categories: true
                    }
                }
            }
        });

        if (!item) {
            throw new Error("Cart item not found");
        }

        return item;
    },

    // Update cart item quantity
    updateCartItem: async (userId: string, itemId: string, quantity: number): Promise<CartItem> => {
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

        const updatedItem = await prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
            include: {
                product: {
                    include: {
                        vendor: true,
                        variants: true,
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