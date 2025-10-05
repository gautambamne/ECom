import { z, infer as zodInfer } from 'zod';

const AddToWishlistSchema = z.object({
    productId: z.string().uuid("Invalid product ID")
});

type IAddToWishlistSchema = zodInfer<typeof AddToWishlistSchema>;

export type {
    IAddToWishlistSchema
}

export {
    AddToWishlistSchema
};