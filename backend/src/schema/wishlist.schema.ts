import { z } from "zod";

// Wishlist schemas
const AddToWishlistSchema = z.object({
    productId: z.string().uuid("Invalid product ID")
});

const ProductIdSchema = z.object({
    productId: z.string().uuid("Invalid product ID")
});

export {
    AddToWishlistSchema,
    ProductIdSchema
};