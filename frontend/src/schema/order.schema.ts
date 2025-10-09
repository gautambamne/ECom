import { z, infer as zodInfer } from 'zod';

// Order item schema
const OrderItemSchema = z.object({
    productId: z.string().uuid("Invalid product ID"),
    quantity: z.number().int().positive("Quantity must be positive").max(100, "Maximum quantity per item is 100")
});

// Shipping address schema
const ShippingAddressSchema = z.object({
    full_name: z.string().min(2, "Full name is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    address_line_1: z.string().min(5, "Address is required"),
    address_line_2: z.string().optional(),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    postal_code: z.string().min(5, "Valid postal code is required"),
    country: z.string().default("India")
}).optional();

// Order schemas
const CreateOrderSchema = z.object({
    items: z.array(OrderItemSchema)
        .min(1, "Order must contain at least one item")
        .max(20, "Maximum 20 items per order")
        .optional(), // Optional because items can come from cart
    shipping_address: ShippingAddressSchema,
    payment_method: z.enum(["COD", "ONLINE", "WALLET"]).default("COD"),
    notes: z.string().max(500, "Notes cannot exceed 500 characters").optional()
});

const UpdateOrderStatusSchema = z.object({
    status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]),
    tracking_number: z.string().optional(),
    notes: z.string().max(500).optional()
});

const OrderIdSchema = z.object({
    orderId: z.string().uuid("Invalid order ID")
});

const OrderQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    status: z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]).optional(),
    date_from: z.string().datetime().optional(),
    date_to: z.string().datetime().optional(),
    sort_by: z.enum(["created_at", "total_price", "status"]).default("created_at"),
    sort_order: z.enum(["asc", "desc"]).default("desc")
});

// Response schemas
const OrderSummarySchema = z.object({
    subtotal: z.number().min(0),
    discount: z.number().min(0),
    tax: z.number().min(0),
    shipping_fee: z.number().min(0),
    total_amount: z.number().min(0),
    currency: z.string().length(3)
});

const OrderItemResponseSchema = z.object({
    product_id: z.number().int().positive(),
    name: z.string(),
    category: z.string(),
    image_url: z.string().url().optional().or(z.literal("")),
    price: z.number().min(0),
    quantity: z.number().int().positive(),
    total: z.number().min(0),
    vendor: z.object({
        id: z.string(),
        name: z.string()
    })
});

const OrderResponseSchema = z.object({
    order_id: z.number().int().positive(),
    order_number: z.string().optional(),
    user_id: z.number().int().positive(),
    status: z.string(),
    items: z.array(OrderItemResponseSchema),
    summary: OrderSummarySchema,
    payment: z.object({
        method: z.string(),
        status: z.string(),
        transaction_id: z.string().optional()
    }).optional(),
    tracking_info: z.object({
        tracking_number: z.string().optional(),
        carrier: z.string().optional(),
        estimated_delivery: z.string().datetime().optional()
    }).optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime()
});

// Type inference
type IOrderItemSchema = zodInfer<typeof OrderItemSchema>;
type IShippingAddressSchema = zodInfer<typeof ShippingAddressSchema>;
type ICreateOrderSchema = zodInfer<typeof CreateOrderSchema>;
type IUpdateOrderStatusSchema = zodInfer<typeof UpdateOrderStatusSchema>;
type IOrderIdSchema = zodInfer<typeof OrderIdSchema>;
type IOrderQuerySchema = zodInfer<typeof OrderQuerySchema>;
type IOrderSummarySchema = zodInfer<typeof OrderSummarySchema>;
type IOrderItemResponseSchema = zodInfer<typeof OrderItemResponseSchema>;
type IOrderResponseSchema = zodInfer<typeof OrderResponseSchema>;

export type {
    IOrderItemSchema,
    IShippingAddressSchema,
    ICreateOrderSchema,
    IUpdateOrderStatusSchema,
    IOrderIdSchema,
    IOrderQuerySchema,
    IOrderSummarySchema,
    IOrderItemResponseSchema,
    IOrderResponseSchema
}

export {
    OrderItemSchema,
    ShippingAddressSchema,
    CreateOrderSchema,
    UpdateOrderStatusSchema,
    OrderIdSchema,
    OrderQuerySchema,
    OrderSummarySchema,
    OrderItemResponseSchema,         
    OrderResponseSchema
};