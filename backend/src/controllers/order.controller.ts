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

        res.status(201).json(new ApiResponse({
            order,
            message: "Order created successfully"
        }));
    }),

    // Get order by ID
    getOrderById: asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        const { orderId } = OrderIdSchema.parse(req.params);
        const order = await OrderService.getOrderById(userId, orderId);

        res.status(200).json(new ApiResponse({
            order,
            message: "Order retrieved successfully"
        }));
    }),

    // Get user's orders
    getUserOrders: asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        const query = OrderQuerySchema.parse(req.query);
        const orders = await OrderService.getUserOrders(userId, query.page, query.limit, query.status);

        res.status(200).json(new ApiResponse({
            orders,
            message: "Orders retrieved successfully"
        }));
    }),

    // Update order status (admin/vendor only)
    updateOrderStatus: asyncHandler(async (req: Request, res: Response) => {
        const { orderId } = OrderIdSchema.parse(req.params);
        const validatedData = UpdateOrderStatusSchema.parse(req.body);
        const order = await OrderService.updateOrderStatus(orderId, validatedData);

        res.status(200).json(new ApiResponse({
            order,
            message: "Order status updated successfully"
        }));
    }),

    // Cancel order
    cancelOrder: asyncHandler(async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        if (!userId) {
            throw new ApiError(401, "Unauthorized");
        }

        const { orderId } = OrderIdSchema.parse(req.params);
        const order = await OrderService.cancelOrder(userId, orderId);

        res.status(200).json(new ApiResponse({
            order,
            message: "Order cancelled successfully"
        }));
    })
};