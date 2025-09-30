import { z } from "zod";

// Payment schemas
const CreatePaymentSchema = z.object({
    orderId: z.string().uuid("Invalid order ID"),
    amount: z.number().positive("Amount must be positive"),
    paymentMethod: z.enum(["CREDIT_CARD", "DEBIT_CARD", "PAYPAL", "BANK_TRANSFER", "CASH_ON_DELIVERY"])
});

const UpdatePaymentStatusSchema = z.object({
    status: z.enum(["PENDING", "SUCCESS", "FAILED"])
});

const PaymentIdSchema = z.object({
    paymentId: z.string().uuid("Invalid payment ID")
});

const PaymentQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    status: z.enum(["PENDING", "SUCCESS", "FAILED"]).optional()
});

export {
    CreatePaymentSchema,
    UpdatePaymentStatusSchema,
    PaymentIdSchema,
    PaymentQuerySchema
};