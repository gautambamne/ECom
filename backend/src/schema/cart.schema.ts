import { z } from "zod";

// Cart schemas
const AddToCartSchema = z.object({
    productId: z.string().uuid("Invalid product ID"),
    quantity: z.number().int().positive().max(100, "Maximum quantity is 100").default(1)
});

const UpdateCartItemSchema = z.object({
    quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Maximum quantity is 100")
});

const CartItemIdSchema = z.object({
    itemId: z.string().uuid("Invalid cart item ID")
});

// New schemas for enhanced functionality
const MoveToCartSchema = z.object({
    quantity: z.number().int().positive().max(100, "Maximum quantity is 100").default(1)
});

const CartSummarySchema = z.object({
    subtotal: z.number().min(0),
    discount: z.number().min(0),
    tax: z.number().min(0),
    shipping_fee: z.number().min(0),
    total_amount: z.number().min(0),
    currency: z.string().length(3, "Currency must be 3 characters")
});

const CartItemResponseSchema = z.object({
    product_id: z.number().int().positive(),
    name: z.string(),
    category: z.string(),
    image_url: z.string().url().optional().or(z.literal("")),
    price: z.number().min(0),
    quantity: z.number().int().positive(),
    total: z.number().min(0),
    in_stock: z.boolean()
});

const CartResponseSchema = z.object({
    user_id: z.number().int().positive(),
    cart_id: z.string(),
    items: z.array(CartItemResponseSchema),
    summary: CartSummarySchema,
    updated_at: z.string().datetime()
});

export {
    AddToCartSchema,
    UpdateCartItemSchema,
    CartItemIdSchema,
    MoveToCartSchema,
    CartSummarySchema,
    CartItemResponseSchema,
    CartResponseSchema
};