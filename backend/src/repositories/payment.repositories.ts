import { prisma } from "../db/connectDb";
import { type Payment } from "../generated/prisma";
import { RedisService } from "../services/redis.service";

export const PaymentRepository = {
    // Create payment for order
    createPayment: async (orderId: string, paymentData: {
        amount: number;
        method: string;
        status?: string;
    }): Promise<Payment> => {
        const payment = await prisma.payment.create({
            data: {
                order_id: orderId,
                amount: paymentData.amount,
                method: paymentData.method,
                status: (paymentData.status || 'PENDING') as any
            },
            include: {
                order: {
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
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        // Invalidate order cache
        await RedisService.delete(`order:${orderId}`);

        return payment;
    },

    // Get payment by ID
    getPaymentById: async (paymentId: string): Promise<Payment | null> => {
        const cacheKey = `payment:${paymentId}`;
        const cachedPayment = await RedisService.getAndRefresh<Payment>(cacheKey);

        if (cachedPayment) {
            return cachedPayment;
        }

        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: {
                order: {
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
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        if (payment) {
            await RedisService.set(cacheKey, payment);
        }

        return payment;
    },

    // Get payment by order ID
    getPaymentByOrderId: async (orderId: string): Promise<Payment | null> => {
        const payment = await prisma.payment.findUnique({
            where: { order_id: orderId },
            include: {
                order: {
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
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        return payment;
    },

    // Update payment status
    updatePaymentStatus: async (paymentId: string, status: string): Promise<Payment> => {
        const payment = await prisma.payment.update({
            where: { id: paymentId },
            data: { status: status as any },
            include: {
                order: {
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
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        // Invalidate caches
        await RedisService.delete(`payment:${paymentId}`);
        await RedisService.delete(`order:${payment.order_id}`);

        return payment;
    },

    // Process payment (simulate payment processing)
    processPayment: async (paymentId: string): Promise<Payment> => {
        // In a real application, this would integrate with payment gateways
        // For now, we'll simulate payment processing

        const payment = await prisma.payment.findUnique({
            where: { id: paymentId },
            include: { order: true }
        });

        if (!payment) {
            throw new Error("Payment not found");
        }

        if (payment.status !== 'PENDING') {
            throw new Error("Payment already processed");
        }

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate success/failure (90% success rate)
        const isSuccess = Math.random() > 0.1;
        const newStatus = isSuccess ? 'SUCCESS' : 'FAILED';

        const updatedPayment = await PaymentRepository.updatePaymentStatus(paymentId, newStatus);

        // If payment successful, update order status
        if (isSuccess && payment.order) {
            await prisma.order.update({
                where: { id: payment.order.id },
                data: { status: 'CONFIRMED' }
            });
        }

        return updatedPayment;
    },

    // Get payments by user
    getUserPayments: async (userId: string, options: {
        skip?: number;
        take?: number;
        status?: string;
    } = {}): Promise<Payment[]> => {
        const { skip = 0, take = 10, status } = options;

        const whereClause: any = {
            order: { user_id: userId }
        };

        if (status) {
            whereClause.status = status;
        }

        const payments = await prisma.payment.findMany({
            where: whereClause,
            include: {
                order: {
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
                        }
                    }
                }
            },
            orderBy: { created_at: 'desc' },
            skip,
            take
        });

        return payments;
    }
};