import { z } from "zod";

// Order schemas
const CreateOrderSchema = z.object({
    items: z.array(z.object({
        productId: z.string().uuid("Invalid product ID"),
        quantity: z.number().int().positive("Quantity must be positive")
    })).min(1, "Order must contain at least one item")
});

const UpdateOrderStatusSchema = z.object({
    status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"])
});

const OrderIdSchema = z.object({
    orderId: z.string().uuid("Invalid order ID")
});

const OrderQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]).optional()
});

export {
    CreateOrderSchema,
    UpdateOrderStatusSchema,
    OrderIdSchema,
    OrderQuerySchema
};