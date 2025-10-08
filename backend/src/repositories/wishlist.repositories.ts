import { prisma } from "../db/connectDb";
import { type Wishlist, type WishlistItem, type Product } from "../generated/prisma";
import { RedisService } from "../services/redis.service";

export const WishlistRepository = {
    // Get or create wishlist for user
    getOrCreateWishlist: async (userId: string): Promise<Wishlist & { items: (WishlistItem & { product: Product & { categories: any[] } })[] }> => {
        const cacheKey = `wishlist:${userId}`;
        const cachedWishlist = await RedisService.getAndRefresh<Wishlist & { items: (WishlistItem & { product: Product & { categories: any[] } })[] }>(cacheKey);

        if (cachedWishlist) {
            return cachedWishlist;
        }

        let wishlist = await prisma.wishlist.findUnique({
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

        if (!wishlist) {
            // Generate a readable wishlist ID
            const wishlistId = `WISHLIST-${Math.random().toString(36).substring(2, 7).toUpperCase()}${Date.now().toString().slice(-3)}`;
            
            wishlist = await prisma.wishlist.create({
                data: { 
                    user_id: userId,
                    wishlist_id: wishlistId
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

        await RedisService.set(cacheKey, wishlist);
        return wishlist;
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

    // Update wishlist item count
    updateWishlistItemCount: async (wishlistId: string, totalItems: number) => {
        return await prisma.wishlist.update({
            where: { id: wishlistId },
            data: {
                total_items: totalItems
            }
        });
    },

    // Add product to wishlist
    addItemToWishlist: async (userId: string, productId: string): Promise<WishlistItem & { product: Product & { categories: any[] } }> => {
        // First get the product to capture price information
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { categories: true }
        });

        if (!product) {
            throw new Error("Product not found");
        }

        const price = product.price;
        const discountPrice = product.discount_price;
        const currency = product.currency;

        // Get or create wishlist
        const wishlist = await WishlistRepository.getOrCreateWishlist(userId);

        // Check if product already exists in wishlist
        const existingItem = wishlist.items.find((item: any) => item.product_id === productId);

        if (existingItem) {
            throw new Error("Product already in wishlist");
        }

        // Add new item with price information
        const newItem = await prisma.wishlistItem.create({
            data: {
                wishlist_id: wishlist.id,
                product_id: productId,
                price,
                discount_price: discountPrice,
                currency
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
        await RedisService.delete(`wishlist:${userId}`);
        return newItem;
    },

    // Remove product from wishlist
    removeItemFromWishlist: async (userId: string, productId: string): Promise<void> => {
        // Get wishlist
        const wishlist = await prisma.wishlist.findUnique({
            where: { user_id: userId },
            include: { items: true }
        });

        if (!wishlist) {
            throw new Error("Wishlist item not found");
        }

        // Find the item
        const item = wishlist.items.find((item: WishlistItem) => item.product_id === productId);

        if (!item) {
            throw new Error("Wishlist item not found");
        }

        await prisma.wishlistItem.delete({
            where: { id: item.id }
        });

        // Invalidate cache
        await RedisService.delete(`wishlist:${userId}`);
    },

    // Check if product is in wishlist
    isProductInWishlist: async (userId: string, productId: string): Promise<boolean> => {
        const wishlist = await WishlistRepository.getOrCreateWishlist(userId);
        return wishlist.items.some((item: any) => item.product_id === productId);
    },

    // Clear wishlist
    clearWishlist: async (userId: string): Promise<void> => {
        const wishlist = await prisma.wishlist.findUnique({
            where: { user_id: userId }
        });

        if (wishlist) {
            await prisma.wishlistItem.deleteMany({
                where: { wishlist_id: wishlist.id }
            });

            // Invalidate cache
            await RedisService.delete(`wishlist:${userId}`);
        }
    },

    // Get wishlist item count
    getWishlistItemCount: async (userId: string): Promise<number> => {
        const wishlist = await WishlistRepository.getOrCreateWishlist(userId);
        return wishlist.items.length;
    }
};