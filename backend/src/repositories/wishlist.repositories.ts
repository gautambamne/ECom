import { prisma } from "../db/connectDb";
import {type Wishlist, type WishlistItem } from "../generated/prisma";
import { RedisService } from "../services/redis.service";

export const WishlistRepository = {
    // Get or create wishlist for user
    getOrCreateWishlist: async (userId: string): Promise<Wishlist & { items: WishlistItem[] }> => {
        const cacheKey = `wishlist:${userId}`;
        const cachedWishlist = await RedisService.getAndRefresh<Wishlist & { items: WishlistItem[] }>(cacheKey);

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
                                vendor: true,
                                variants: true,
                                categories: true
                            }
                        }
                    }
                }
            }
        });

        if (!wishlist) {
            wishlist = await prisma.wishlist.create({
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

        await RedisService.set(cacheKey, wishlist);
        return wishlist;
    },

    // Add product to wishlist
    addToWishlist: async (userId: string, productId: string): Promise<WishlistItem> => {
        // Get or create wishlist
        const wishlist = await prisma.wishlist.findUnique({
            where: { user_id: userId },
            include: { items: true }
        });

        if (!wishlist) {
            // Create wishlist and add item
            const newWishlist = await prisma.wishlist.create({
                data: {
                    user_id: userId,
                    items: {
                        create: {
                            product_id: productId
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
            await RedisService.delete(`wishlist:${userId}`);
            return newWishlist.items[0]!;
        }

        // Check if product already exists in wishlist
        const existingItem = wishlist.items.find((item: WishlistItem) => item.product_id === productId);

        if (existingItem) {
            throw new Error("Product already in wishlist");
        }

        // Add new item
        const newItem = await prisma.wishlistItem.create({
            data: {
                wishlist_id: wishlist.id,
                product_id: productId
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
        await RedisService.delete(`wishlist:${userId}`);
        return newItem;
    },

    // Remove product from wishlist
    removeFromWishlist: async (userId: string, productId: string): Promise<void> => {
        // Get wishlist
        const wishlist = await prisma.wishlist.findUnique({
            where: { user_id: userId },
            include: { items: true }
        });

        if (!wishlist) {
            throw new Error("Wishlist not found");
        }

        // Find the item
        const item = wishlist.items.find((item: WishlistItem) => item.product_id === productId);

        if (!item) {
            throw new Error("Product not in wishlist");
        }

        await prisma.wishlistItem.delete({
            where: { id: item.id }
        });

        // Invalidate cache
        await RedisService.delete(`wishlist:${userId}`);
    },

    // Check if product is in wishlist
    isInWishlist: async (userId: string, productId: string): Promise<boolean> => {
        const wishlist = await WishlistRepository.getOrCreateWishlist(userId);
        return wishlist.items.some((item: WishlistItem) => item.product_id === productId);
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