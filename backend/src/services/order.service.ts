import { OrderRepository } from "../repositories/order.repositories";
import { CartRepository } from "../repositories/cart.repositories";
import { ProductRepository } from "../repositories/product.repositories";
import { ApiError } from "../advices/ApiError";
import { CreateOrderSchema, UpdateOrderStatusSchema } from "../schema/order.schema";
import type { z } from "zod";

export const OrderService = {
    // Create new order
    async createOrder(userId: string, orderData: z.infer<typeof CreateOrderSchema>) {
        try {
            // Validate order data
            const validatedData = CreateOrderSchema.parse(orderData);

            // Get user's cart
            const cart = await CartRepository.getOrCreateCart(userId);
            if (!cart || cart.items.length === 0) {
                throw new ApiError(400, "Cart is empty");
            }

            // If specific items provided, validate they exist in cart
            if (validatedData.items) {
                for (const item of validatedData.items) {
                    const cartItem = cart.items.find((ci: any) => ci.product_id === item.productId);
                    if (!cartItem) {
                        throw new ApiError(400, `Product ${item.productId} not found in cart`);
                    }
                    if (cartItem.quantity < item.quantity) {
                        throw new ApiError(400, `Insufficient quantity for product ${item.productId}`);
                    }
                }
            }

            // Check product availability and calculate total
            let totalAmount = 0;
            const orderItems: Array<{ productId: string; quantity: number; price: number }> = [];

            const itemsToProcess = validatedData.items || cart.items.map((item: any) => ({
                productId: item.product_id,
                quantity: item.quantity
            }));

            for (const item of itemsToProcess) {
                const product = await ProductRepository.getProductById(item.productId);
                if (!product) {
                    throw new ApiError(404, `Product ${item.productId} not found`);
                }
                if (product.stock < item.quantity) {
                    throw new ApiError(400, `Insufficient stock for product ${product.name}`);
                }
                orderItems.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: product.price
                });
                totalAmount += product.price * item.quantity;
            }

            // Create order
            const order = await OrderRepository.createOrder(userId, {
                items: orderItems,
                totalPrice: totalAmount
            });

            // Clear cart after successful order creation
            await CartRepository.clearCart(userId);

            return order;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Failed to create order");
        }
    },

    // Get order by ID
    async getOrderById(userId: string, orderId: string) {
        try {
            const order = await OrderRepository.getOrderById(orderId);
            if (!order) {
                throw new ApiError(404, "Order not found");
            }

            // Check if user owns the order
            if (order.user_id !== userId) {
                throw new ApiError(403, "Access denied");
            }

            return order;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Failed to get order");
        }
    },

    // Get user's orders
    async getUserOrders(userId: string, page: number = 1, limit: number = 10, status?: string) {
        try {
            const skip = (page - 1) * limit;
            return await OrderRepository.getUserOrders(userId, { skip, take: limit, status });
        } catch (error) {
            throw new ApiError(500, "Failed to get orders");
        }
    },

    // Update order status
    async updateOrderStatus(orderId: string, statusData: z.infer<typeof UpdateOrderStatusSchema>) {
        try {
            const validatedData = UpdateOrderStatusSchema.parse(statusData);

            const order = await OrderRepository.getOrderById(orderId);
            if (!order) {
                throw new ApiError(404, "Order not found");
            }

            // Business logic for status transitions
            const currentStatus = order.status;
            const newStatus = validatedData.status;

            // Define valid status transitions
            const validTransitions: Record<string, string[]> = {
                PENDING: ["CONFIRMED", "CANCELLED"],
                CONFIRMED: ["SHIPPED", "CANCELLED"],
                SHIPPED: ["DELIVERED"],
                DELIVERED: [], // Final state
                CANCELLED: [] // Final state
            };

            if (!validTransitions[currentStatus]?.includes(newStatus)) {
                throw new ApiError(400, `Invalid status transition from ${currentStatus} to ${newStatus}`);
            }

            return await OrderRepository.updateOrderStatus(orderId, newStatus);
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Failed to update order status");
        }
    },

    // Cancel order
    async cancelOrder(userId: string, orderId: string) {
        try {
            const order = await OrderRepository.getOrderById(orderId);
            if (!order) {
                throw new ApiError(404, "Order not found");
            }

            if (order.user_id !== userId) {
                throw new ApiError(403, "Access denied");
            }

            if (order.status !== "PENDING" && order.status !== "CONFIRMED") {
                throw new ApiError(400, "Order cannot be cancelled at this stage");
            }

            return await OrderRepository.updateOrderStatus(orderId, "CANCELLED");
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Failed to cancel order");
        }
    }
};