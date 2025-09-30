import { PaymentRepository } from "../repositories/payment.repositories";
import { OrderRepository } from "../repositories/order.repositories";
import { ApiError } from "../advices/ApiError";
import { CreatePaymentSchema, UpdatePaymentStatusSchema } from "../schema/payment.schema";
import type { z } from "zod";

export const PaymentService = {
    // Create payment for order
    async createPayment(userId: string, paymentData: z.infer<typeof CreatePaymentSchema>) {
        try {
            const validatedData = CreatePaymentSchema.parse(paymentData);

            // Verify order exists and belongs to user
            const order = await OrderRepository.getOrderById(validatedData.orderId, userId);
            if (!order) {
                throw new ApiError(404, "Order not found");
            }

            if (order.user_id !== userId) {
                throw new ApiError(403, "Access denied");
            }

            // Check if order already has a payment
            const existingPayment = await PaymentRepository.getPaymentByOrderId(validatedData.orderId);
            if (existingPayment) {
                throw new ApiError(400, "Order already has a payment");
            }

            // Create payment
            const payment = await PaymentRepository.createPayment(validatedData.orderId, {
                amount: validatedData.amount,
                method: validatedData.paymentMethod
            });

            return payment;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Failed to create payment");
        }
    },

    // Get payment by ID
    async getPaymentById(userId: string, paymentId: string) {
        try {
            const payment = await PaymentRepository.getPaymentById(paymentId);
            if (!payment) {
                throw new ApiError(404, "Payment not found");
            }

            // Check if user owns the payment through order
            const order = await OrderRepository.getOrderById(payment.order_id, userId);
            if (!order || order.user_id !== userId) {
                throw new ApiError(403, "Access denied");
            }

            return payment;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Failed to get payment");
        }
    },

    // Get payments for user
    async getUserPayments(userId: string, page: number = 1, limit: number = 10, status?: string) {
        try {
            const skip = (page - 1) * limit;
            return await PaymentRepository.getUserPayments(userId, { skip, take: limit, status });
        } catch (error) {
            throw new ApiError(500, "Failed to get payments");
        }
    },

    // Process payment (simulate payment processing)
    async processPayment(paymentId: string) {
        try {
            const payment = await PaymentRepository.getPaymentById(paymentId);
            if (!payment) {
                throw new ApiError(404, "Payment not found");
            }

            if (payment.status !== "PENDING") {
                throw new ApiError(400, "Payment is not in pending status");
            }

            // Simulate payment processing logic
            // In a real application, this would integrate with payment gateways
            const success = Math.random() > 0.1; // 90% success rate for demo

            const newStatus = success ? "SUCCESS" : "FAILED";
            const updatedPayment = await PaymentRepository.updatePaymentStatus(paymentId, newStatus);

            // If payment completed, update order status
            if (success) {
                await OrderRepository.updateOrderStatus(payment.order_id, "CONFIRMED");
            }

            return updatedPayment;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Failed to process payment");
        }
    },

    // Update payment status
    async updatePaymentStatus(paymentId: string, statusData: z.infer<typeof UpdatePaymentStatusSchema>) {
        try {
            const validatedData = UpdatePaymentStatusSchema.parse(statusData);

            const payment = await PaymentRepository.getPaymentById(paymentId);
            if (!payment) {
                throw new ApiError(404, "Payment not found");
            }

            // Business logic for status transitions
            const currentStatus = payment.status;
            const newStatus = validatedData.status;

            const validTransitions: Record<string, string[]> = {
                PENDING: ["SUCCESS", "FAILED"],
                SUCCESS: [], // Final state
                FAILED: ["PENDING"] // Allow retry
            };

            if (!validTransitions[currentStatus]?.includes(newStatus)) {
                throw new ApiError(400, `Invalid status transition from ${currentStatus} to ${newStatus}`);
            }

            const updatedPayment = await PaymentRepository.updatePaymentStatus(paymentId, newStatus);

            // Update order status based on payment status
            if (newStatus === "SUCCESS") {
                await OrderRepository.updateOrderStatus(payment.order_id, "CONFIRMED");
            } else if (newStatus === "FAILED") {
                await OrderRepository.updateOrderStatus(payment.order_id, "CANCELLED");
            }

            return updatedPayment;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Failed to update payment status");
        }
    },

    // Refund payment
    async refundPayment(userId: string, paymentId: string) {
        try {
            const payment = await PaymentRepository.getPaymentById(paymentId);
            if (!payment) {
                throw new ApiError(404, "Payment not found");
            }

            // Check if user owns the payment
            const order = await OrderRepository.getOrderById(payment.order_id, userId);
            if (!order || order.user_id !== userId) {
                throw new ApiError(403, "Access denied");
            }

            if (payment.status !== "SUCCESS") {
                throw new ApiError(400, "Only successful payments can be refunded");
            }

            // Check if order can be refunded (not shipped/delivered)
            if (order.status === "SHIPPED" || order.status === "DELIVERED") {
                throw new ApiError(400, "Order cannot be refunded at this stage");
            }

            const updatedPayment = await PaymentRepository.updatePaymentStatus(paymentId, "REFUNDED");
            await OrderRepository.updateOrderStatus(payment.order_id, "CANCELLED");

            return updatedPayment;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Failed to refund payment");
        }
    }
};