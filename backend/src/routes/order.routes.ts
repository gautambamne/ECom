import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/role.middleware";
import { UserRole } from "../generated/prisma";

const router = Router();

// All order routes require authentication
router.use(authMiddleware);

// Create new order
router.post("/", OrderController.createOrder);

// Get user's orders
router.get("/", OrderController.getUserOrders);

// Get specific order
router.get("/:orderId", OrderController.getOrderById);

// Cancel order
router.patch("/:orderId/cancel", OrderController.cancelOrder);

// Update order status (admin/vendor only)
router.patch("/:orderId/status", checkRole([UserRole.ADMIN, UserRole.VENDOR]), OrderController.updateOrderStatus);

export default router;