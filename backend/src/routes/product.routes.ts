import { Router } from "express";
import {
  CreateProductController,
  DeleteProductController,
  GetProductController,
  GetProductsByCategoryController,
  GetProductsController,
  GetVendorProductsController,
  UpdateProductController,
} from "../controllers/product.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { isVendor } from "../middleware/role.middleware";

const router = Router();

// Public routes - no authentication needed
router.get("/search", GetProductsController); // Search/filter products
router.get("/category/:categoryId", GetProductsByCategoryController);
router.get("/:id", GetProductController);

// Protected routes - require authentication
router.use(authMiddleware);

// Vendor routes - require vendor role
router.post("/", isVendor, CreateProductController);
router.put("/:id", isVendor, UpdateProductController);
router.delete("/:id", isVendor, DeleteProductController);

// Vendor product listing routes
router.get("/vendor/me", isVendor, GetVendorProductsController); // Get logged-in vendor's products
router.get("/vendor/:vendorId", GetVendorProductsController); // Public vendor products (no vendor role needed)

export default router;