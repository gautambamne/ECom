import { z, infer as zodInfer } from 'zod';

const AddToCartSchema = z.object({
    productId: z.string().uuid("Invalid product ID"),
    quantity: z.number().int().positive().default(1)
});

const UpdateCartItemSchema = z.object({
    quantity: z.number().int().min(1, "Quantity must be at least 1")
});

type IAddToCartSchema = zodInfer<typeof AddToCartSchema>;
type IUpdateCartItemSchema = zodInfer<typeof UpdateCartItemSchema>;

export type {
    IAddToCartSchema,
    IUpdateCartItemSchema
}

export {
    AddToCartSchema,
    UpdateCartItemSchema
};