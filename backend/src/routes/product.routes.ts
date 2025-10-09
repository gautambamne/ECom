import { Router } from "express";
import {
  CreateProductController,
  DeleteProductController,
  GetProductByIdController,
  GetProductsByCategoryController,
  GetProductsController,
  GetVendorProductsController,
  UpdateProductController,
} from "../controllers/product.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { isVendor } from "../middleware/role.middleware";
import { uploadSingle, uploadMultiple } from "../middleware/multer.middleware";

const router = Router();

// Public routes - no authentication needed
router.get("/search", GetProductsController); // Search/filter products
router.get("/categories/:categoryId", GetProductsByCategoryController);
router.get("/:id", GetProductByIdController);

// Protected routes - require authentication
router.use(authMiddleware);

// Vendor routes - require vendor role
router.post("/", isVendor, uploadMultiple, CreateProductController);
router.put("/:id", isVendor, uploadMultiple, UpdateProductController);
router.delete("/:id", isVendor, DeleteProductController);

// Vendor product listing routes
router.get("/vendor/me", isVendor, GetVendorProductsController); // Get logged-in vendor's products
router.get("/vendor/:vendorId", GetVendorProductsController); // Public vendor products (no vendor role needed)

export default router;