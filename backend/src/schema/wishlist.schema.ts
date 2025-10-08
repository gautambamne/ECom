import { z } from "zod";

// Wishlist schemas
const AddToWishlistSchema = z.object({
    productId: z.string().uuid("Invalid product ID")
});

const ProductIdSchema = z.object({
    productId: z.string().uuid("Invalid product ID")
});

// New schemas for enhanced functionality
const WishlistItemResponseSchema = z.object({
    product_id: z.number().int().positive(),
    name: z.string(),
    category: z.string(),
    image_url: z.string().url().optional().or(z.literal("")),
    price: z.number().min(0),
    discount_price: z.number().min(0).nullable(),
    currency: z.string().length(3, "Currency must be 3 characters"),
    in_stock: z.boolean(),
    added_at: z.string().datetime()
});

const WishlistResponseSchema = z.object({
    user_id: z.number().int().positive(),
    wishlist_id: z.string(),
    items: z.array(WishlistItemResponseSchema),
    total_items: z.number().int().min(0),
    updated_at: z.string().datetime()
});

const MoveToCartFromWishlistSchema = z.object({
    quantity: z.number().int().positive().max(100, "Maximum quantity is 100").default(1)
});

export {
    AddToWishlistSchema,
    ProductIdSchema,
    WishlistItemResponseSchema,
    WishlistResponseSchema,
    MoveToCartFromWishlistSchema
};