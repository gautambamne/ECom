import { OrderRepository } from "../repositories/order.repositories";
import { CartRepository } from "../repositories/cart.repositories";
import { ProductRepository } from "../repositories/product.repositories";
import { ApiError } from "../advices/ApiError";
import { CreateOrderSchema, UpdateOrderStatusSchema } from "../schema/order.schema";
import type { z } from "zod";

interface OrderSummary {
    subtotal: number;
    discount: number;
    tax: number;
    shipping_fee: number;
    total_amount: number;
    currency: string;
}

interface OrderItemFormatted {
    product_id: number;
    name: string;
    category: string;
    image_url: string;
    price: number;
    quantity: number;
    total: number;
    vendor: {
        id: string;
        name: string;
    };
}

interface FormattedOrder {
    order_id: number;
    order_number?: string;
    user_id: number;
    status: string;
    items: OrderItemFormatted[];
    summary: OrderSummary;
    payment?: {
        method: string;
        status: string;
        transaction_id?: string;
    };
    shipping_address?: any;
    tracking_info?: {
        tracking_number?: string;
        carrier?: string;
        estimated_delivery?: string;
    };
    created_at: string;
    updated_at: string;
}

export const OrderService = {
    // Calculate order summary
    calculateOrderSummary(items: any[], currency: string = "INR"): OrderSummary {
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Calculate discount (implement your discount logic)
        const discount = 0; // For now, no discount
        
        // Calculate tax (4.5% example)
        const taxRate = 0.045;
        const taxableAmount = subtotal - discount;
        const tax = Math.round(taxableAmount * taxRate * 100) / 100;
        
        // Calculate shipping
        const shipping_fee = subtotal >= 500 ? 0 : 50;
        
        const total_amount = subtotal - discount + tax + shipping_fee;
        
        return {
            subtotal: Math.round(subtotal * 100) / 100,
            discount: Math.round(discount * 100) / 100,
            tax,
            shipping_fee,
            total_amount: Math.round(total_amount * 100) / 100,
            currency
        };
    },

    // Format order for API response
    formatOrderResponse(order: any): FormattedOrder {
        const formattedItems: OrderItemFormatted[] = order.items?.map((item: any) => ({
            product_id: Math.abs(item.product?.id?.split('-').join('').slice(0, 8).split('').reduce((a: number, b: string) => ((a << 5) - a) + b.charCodeAt(0), 0) || 0),
            name: item.product?.name || "Unknown Product",
            category: item.product?.categories?.[0]?.name || "Uncategorized",
            image_url: item.product?.images?.[0] || "",
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
            vendor: {
                id: item.product?.vendor_id || "",
                name: item.product?.vendor?.name || "Unknown Vendor"
            }
        })) || [];

        const summary = this.calculateOrderSummary(formattedItems);

        return {
            order_id: Math.abs(order.id.split('-').join('').slice(0, 8).split('').reduce((a: number, b: string) => ((a << 5) - a) + b.charCodeAt(0), 0)),
            order_number: `ORD-${order.id.slice(-8).toUpperCase()}`,
            user_id: Math.abs(order.user_id.split('-').join('').slice(0, 8).split('').reduce((a: number, b: string) => ((a << 5) - a) + b.charCodeAt(0), 0)),
            status: order.status,
            items: formattedItems,
            summary,
            payment: order.payment ? {
                method: order.payment.method,
                status: order.payment.status,
                transaction_id: order.payment.id
            } : undefined,
            tracking_info: order.status === 'SHIPPED' || order.status === 'DELIVERED' ? {
                tracking_number: `TRK-${order.id.slice(-6).toUpperCase()}`,
                carrier: "Standard Delivery",
                estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
            } : undefined,
            created_at: order.created_at?.toISOString() || new Date().toISOString(),
            updated_at: order.updated_at?.toISOString() || new Date().toISOString()
        };
    },

    // Update inventory after order creation
    async updateInventoryAfterOrder(orderItems: any[]) {
        for (const item of orderItems) {
            const product = await ProductRepository.getProductById(item.productId);
            if (product && product.stock >= item.quantity) {
                await ProductRepository.updateProductStock(item.productId, product.stock - item.quantity);
            }
        }
    },
    // Create new order
    async createOrder(userId: string, orderData: z.infer<typeof CreateOrderSchema>): Promise<FormattedOrder> {
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
                
                const price = product.discount_price || product.price;
                orderItems.push({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: price
                });
                totalAmount += price * item.quantity;
            }

            // Create order
            const order = await OrderRepository.createOrder(userId, {
                items: orderItems,
                totalPrice: totalAmount
            });

            // Update inventory (comment out for now due to missing method)
            // await this.updateInventoryAfterOrder(orderItems);

            // Clear cart after successful order creation
            await CartRepository.clearCart(userId);

            // Get full order details with relations for formatting
            const fullOrder = await OrderRepository.getOrderById(order.id);
            
            return this.formatOrderResponse(fullOrder);
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Failed to create order");
        }
    },

    // Get order by ID
    async getOrderById(userId: string, orderId: string): Promise<FormattedOrder> {
        try {
            const order = await OrderRepository.getOrderById(orderId);
            if (!order) {
                throw new ApiError(404, "Order not found");
            }

            // Check if user owns the order
            if (order.user_id !== userId) {
                throw new ApiError(403, "Access denied");
            }

            return this.formatOrderResponse(order);
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Failed to get order");
        }
    },

    // Get user's orders
    async getUserOrders(userId: string, page: number = 1, limit: number = 10, status?: string) {
        try {
            const skip = (page - 1) * limit;
            const orders = await OrderRepository.getUserOrders(userId, { skip, take: limit, status });
            
            return {
                orders: orders.map((order: any) => this.formatOrderResponse(order)),
                pagination: {
                    page,
                    limit,
                    total: orders.length, // For now, until we update the repository
                    totalPages: Math.ceil(orders.length / limit)
                }
            };
        } catch (error) {
            throw new ApiError(500, "Failed to get orders");
        }
    },

    // Update order status
    async updateOrderStatus(orderId: string, statusData: z.infer<typeof UpdateOrderStatusSchema>): Promise<FormattedOrder> {
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

            const updatedOrder = await OrderRepository.updateOrderStatus(orderId, newStatus);
            return this.formatOrderResponse(updatedOrder);
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Failed to update order status");
        }
    },

    // Cancel order
    async cancelOrder(userId: string, orderId: string): Promise<FormattedOrder> {
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

            const cancelledOrder = await OrderRepository.updateOrderStatus(orderId, "CANCELLED");
            return this.formatOrderResponse(cancelledOrder);
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Failed to cancel order");
        }
    },

    // Get order statistics for user
    async getOrderStats(userId: string) {
        try {
            const orders = await OrderRepository.getUserOrders(userId, { skip: 0, take: 1000 }); // Get all orders
            
            const stats = {
                total_orders: orders.length,
                pending_orders: orders.filter((o: any) => o.status === 'PENDING').length,
                confirmed_orders: orders.filter((o: any) => o.status === 'CONFIRMED').length,
                shipped_orders: orders.filter((o: any) => o.status === 'SHIPPED').length,
                delivered_orders: orders.filter((o: any) => o.status === 'DELIVERED').length,
                cancelled_orders: orders.filter((o: any) => o.status === 'CANCELLED').length,
                total_spent: orders
                    .filter((o: any) => o.status !== 'CANCELLED')
                    .reduce((sum: number, order: any) => sum + order.total_price, 0)
            };

            return stats;
        } catch (error) {
            throw new ApiError(500, "Failed to get order statistics");
        }
    },

    // Track order
    async trackOrder(userId: string, orderId: string) {
        try {
            const order = await this.getOrderById(userId, orderId);
            
            const trackingInfo = {
                order_id: order.order_id,
                order_number: order.order_number,
                status: order.status,
                tracking_info: order.tracking_info,
                status_history: [
                    { status: 'PENDING', date: order.created_at, description: 'Order placed successfully' },
                    ...(order.status !== 'PENDING' ? [{ status: 'CONFIRMED', date: order.updated_at, description: 'Order confirmed and being processed' }] : []),
                    ...(order.status === 'SHIPPED' || order.status === 'DELIVERED' ? [{ status: 'SHIPPED', date: order.updated_at, description: 'Order shipped and on the way' }] : []),
                    ...(order.status === 'DELIVERED' ? [{ status: 'DELIVERED', date: order.updated_at, description: 'Order delivered successfully' }] : []),
                    ...(order.status === 'CANCELLED' ? [{ status: 'CANCELLED', date: order.updated_at, description: 'Order cancelled' }] : [])
                ]
            };

            return trackingInfo;
        } catch (error) {
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, "Failed to track order");
        }
    }
};