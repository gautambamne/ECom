import { type Request, type Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiResponse } from "../advices/ApiResponse";
import { ApiError } from "../advices/ApiError";
import { OrderService } from "../services/order.service";
import { CreateOrderSchema, UpdateOrderStatusSchema, OrderIdSchema, OrderQuerySchema } from "../schema/order.schema";

export const OrderController = {
    
    // Create new order
    createOrder: asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        const validatedData = CreateOrderSchema.parse(req.body);
        const order = await OrderService.createOrder(userId, validatedData);

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order
        });
    }),

    
    // Get order by ID
    getOrderById: asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        const { orderId } = OrderIdSchema.parse(req.params);
        const order = await OrderService.getOrderById(userId, orderId);

        res.status(200).json({
            success: true,
            message: "Order retrieved successfully",
            data: order
        });
    }),

    
    // Get user's orders
    getUserOrders: asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        const query = OrderQuerySchema.parse(req.query);
        const result = await OrderService.getUserOrders(userId, query.page, query.limit, query.status);

        res.status(200).json({
            success: true,
            message: "Orders retrieved successfully",
            data: result
        });
    }),

    
    // Update order status (admin/vendor only)
    updateOrderStatus: asyncHandler(async (req: Request, res: Response) => {
        const { orderId } = OrderIdSchema.parse(req.params);
        const validatedData = UpdateOrderStatusSchema.parse(req.body);
        const order = await OrderService.updateOrderStatus(orderId, validatedData);

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order
        });
    }),

    // Cancel order
    cancelOrder: asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        const { orderId } = OrderIdSchema.parse(req.params);
        const order = await OrderService.cancelOrder(userId, orderId);

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: order
        });
    }),


    // Track order
    trackOrder: asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        const { orderId } = OrderIdSchema.parse(req.params);
        const tracking = await OrderService.trackOrder(userId, orderId);

        res.status(200).json({
            success: true,
            message: "Order tracking retrieved successfully",
            data: tracking
        });
    })
};
