import { type Request, type Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiResponse } from "../advices/ApiResponse";
import { ApiError } from "../advices/ApiError";
import { PaymentService } from "../services/payment.service";
import { CreatePaymentSchema, UpdatePaymentStatusSchema, PaymentIdSchema, PaymentQuerySchema } from "../schema/payment.schema";

export const PaymentController = {
    // Create payment for order
    createPayment: asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        const validatedData = CreatePaymentSchema.parse(req.body);
        const payment = await PaymentService.createPayment(userId, validatedData);

        res.status(201).json(new ApiResponse({
            payment,
            message: "Payment created successfully"
        }));
    }),

    // Get payment by ID
    getPaymentById: asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        const { paymentId } = PaymentIdSchema.parse(req.params);
        const payment = await PaymentService.getPaymentById(userId, paymentId);

        res.status(200).json(new ApiResponse({
            payment,
            message: "Payment retrieved successfully"
        }));
    }),

    // Get user's payments
    getUserPayments: asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        const query = PaymentQuerySchema.parse(req.query);
        const payments = await PaymentService.getUserPayments(userId, query.page, query.limit, query.status);

        res.status(200).json(new ApiResponse({
            payments,
            message: "Payments retrieved successfully"
        }));
    }),

    // Process payment
    processPayment: asyncHandler(async (req: Request, res: Response) => {
        const { paymentId } = PaymentIdSchema.parse(req.params);
        const payment = await PaymentService.processPayment(paymentId);

        res.status(200).json(new ApiResponse({
            payment,
            message: "Payment processed successfully"
        }));
    }),

    // Update payment status (admin only)
    updatePaymentStatus: asyncHandler(async (req: Request, res: Response) => {
        const { paymentId } = PaymentIdSchema.parse(req.params);
        const validatedData = UpdatePaymentStatusSchema.parse(req.body);
        const payment = await PaymentService.updatePaymentStatus(paymentId, validatedData);

        res.status(200).json(new ApiResponse({
            payment,
            message: "Payment status updated successfully"
        }));
    }),

    // Refund payment
    refundPayment: asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        const { paymentId } = PaymentIdSchema.parse(req.params);
        const payment = await PaymentService.refundPayment(userId, paymentId);

        res.status(200).json(new ApiResponse({
            payment,
            message: "Payment refunded successfully"
        }));
    })
};