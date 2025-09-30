import { z } from "zod";

// Cart schemas
const AddToCartSchema = z.object({
    productId: z.string().uuid("Invalid product ID"),
    quantity: z.number().int().positive().default(1)
});

const UpdateCartItemSchema = z.object({
    quantity: z.number().int().min(1, "Quantity must be at least 1")
});

const CartItemIdSchema = z.object({
    itemId: z.string().uuid("Invalid cart item ID")
});

export {
    AddToCartSchema,
    UpdateCartItemSchema,
    CartItemIdSchema
};