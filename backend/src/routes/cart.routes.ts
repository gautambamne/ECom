import { Router } from "express";
import {
    GetCartController,
    AddToCartController,
    UpdateCartItemController,
    RemoveFromCartController,
    ClearCartController,
    GetCartItemCountController
} from "../controllers/cart.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// All cart routes require authentication
router.use(authMiddleware);

// Cart routes
router.get("/", GetCartController);
router.post("/items", AddToCartController);
router.put("/items/:itemId", UpdateCartItemController);
router.delete("/items/:itemId", RemoveFromCartController);
router.delete("/", ClearCartController);
router.get("/count", GetCartItemCountController);

export default router;