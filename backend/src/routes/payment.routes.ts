import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/role.middleware";
import { UserRole } from "../generated/prisma";

const router = Router();

// All payment routes require authentication
router.use(authMiddleware);

// Create payment for order
router.post("/", PaymentController.createPayment);

// Get user's payments
router.get("/", PaymentController.getUserPayments);

// Get specific payment
router.get("/:paymentId", PaymentController.getPaymentById);

// Process payment
router.post("/:paymentId/process", PaymentController.processPayment);

// Update payment status (admin only)
router.patch("/:paymentId/status", checkRole([UserRole.ADMIN]), PaymentController.updatePaymentStatus);

// Refund payment
router.post("/:paymentId/refund", PaymentController.refundPayment);

export default router;