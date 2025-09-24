import { prisma } from "../db/connectDb";
import { type Order, type OrderItem, type Payment } from "../generated/prisma";
import { RedisService } from "../services/redis.service";

export const OrderRepository = {
    // Create order from cart items
    createOrder: async (userId: string, orderData: {
        items: Array<{ productId: string; quantity: number; price: number }>;
        totalPrice: number;
    }): Promise<Order> => {
        const order = await prisma.order.create({
            data: {
                user_id: userId,
                total_price: orderData.totalPrice,
                items: {
                    create: orderData.items.map(item => ({
                        product_id: item.productId,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                vendor: true,
                                variants: true,
                                categories: true
                            }
                        }
                    }
                },
                payment: true
            }
        });

        // Invalidate user's cart cache
        await RedisService.delete(`cart:${userId}`);

        return order;
    },

    // Get order by ID
    getOrderById: async (orderId: string, userId?: string): Promise<Order | null> => {
        const cacheKey = `order:${orderId}`;
        const cachedOrder = await RedisService.getAndRefresh<Order>(cacheKey);

        if (cachedOrder) {
            return cachedOrder;
        }

        const whereClause = userId ? { id: orderId, user_id: userId } : { id: orderId };

        const order = await prisma.order.findFirst({
            where: whereClause,
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                vendor: true,
                                variants: true,
                                categories: true
                            }
                        }
                    }
                },
                payment: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (order) {
            await RedisService.set(cacheKey, order);
        }

        return order;
    },

    // Get user's orders
    getUserOrders: async (userId: string, options: {
        skip?: number;
        take?: number;
        status?: string;
    } = {}): Promise<Order[]> => {
        const { skip = 0, take = 10, status } = options;

        const whereClause: any = { user_id: userId };
        if (status) {
            whereClause.status = status;
        }

        const orders = await prisma.order.findMany({
            where: whereClause,
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                vendor: true,
                                variants: true,
                                categories: true
                            }
                        }
                    }
                },
                payment: true
            },
            orderBy: { created_at: 'desc' },
            skip,
            take
        });

        return orders;
    },

    // Update order status
    updateOrderStatus: async (orderId: string, status: string, userId?: string): Promise<Order> => {
        const whereClause = userId ? { id: orderId, user_id: userId } : { id: orderId };

        const order = await prisma.order.update({
            where: whereClause,
            data: { status: status as any },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                vendor: true,
                                variants: true,
                                categories: true
                            }
                        }
                    }
                },
                payment: true
            }
        });

        // Invalidate cache
        await RedisService.delete(`order:${orderId}`);

        return order;
    },

    // Cancel order
    cancelOrder: async (orderId: string, userId: string): Promise<Order> => {
        const order = await prisma.order.findFirst({
            where: { id: orderId, user_id: userId }
        });

        if (!order) {
            throw new Error("Order not found");
        }

        if (order.status !== 'PENDING') {
            throw new Error("Order cannot be cancelled");
        }

        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                vendor: true,
                                variants: true,
                                categories: true
                            }
                        }
                    }
                },
                payment: true
            }
        });

        // Invalidate cache
        await RedisService.delete(`order:${orderId}`);

        return updatedOrder;
    },

    // Get order count for user
    getUserOrderCount: async (userId: string): Promise<number> => {
        return await prisma.order.count({
            where: { user_id: userId }
        });
    }
};