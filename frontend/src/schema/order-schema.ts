import { z, infer as zodInfer } from 'zod';

const AddressSchema = z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    postal_code: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
});

const CreateOrderSchema = z.object({
    shipping_address: AddressSchema,
    billing_address: AddressSchema,
    payment_method: z.string().min(1, "Payment method is required"),
});

const UpdateOrderStatusSchema = z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

type ICreateOrderSchema = zodInfer<typeof CreateOrderSchema>;
type IUpdateOrderStatusSchema = zodInfer<typeof UpdateOrderStatusSchema>;

export type {
    ICreateOrderSchema,
    IUpdateOrderStatusSchema
}

export {
    CreateOrderSchema,
    UpdateOrderStatusSchema
};