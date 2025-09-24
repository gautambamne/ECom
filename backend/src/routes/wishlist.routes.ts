import { Router } from "express";
import {
    GetWishlistController,
    AddToWishlistController,
    RemoveFromWishlistController,
    CheckWishlistStatusController,
    ClearWishlistController,
    GetWishlistItemCountController
} from "../controllers/wishlist.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// All wishlist routes require authentication
router.use(authMiddleware);

// Wishlist routes
router.get("/", GetWishlistController);
router.post("/items", AddToWishlistController);
router.delete("/items/:productId", RemoveFromWishlistController);
router.get("/status/:productId", CheckWishlistStatusController);
router.delete("/", ClearWishlistController);
router.get("/count", GetWishlistItemCountController);

export default router;