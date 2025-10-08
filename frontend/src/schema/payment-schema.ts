import { z, infer as zodInfer } from 'zod';

const CreatePaymentSchema = z.object({
    order_id: z.string().min(1, "Order ID is required"),
    payment_method: z.string().min(1, "Payment method is required"),
    amount: z.number().positive("Amount must be positive"),
});

type ICreatePaymentSchema = zodInfer<typeof CreatePaymentSchema>;

export type {
    ICreatePaymentSchema
}

export {
    CreatePaymentSchema
};