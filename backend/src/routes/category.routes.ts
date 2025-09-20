import { Router } from "express";
import {
  CreateCategoryController,
  DeleteCategoryController,
  GetCategoriesController,
  GetCategoryController,
  UpdateCategoryController,
} from "../controllers/category.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { checkRole } from "../middleware/role.middleware";

const router = Router();

// Public routes - Anyone can view categories
router.get("/", GetCategoriesController);
router.get("/:id", GetCategoryController);

// Protected routes - Only admin can manage categories
router.use(authMiddleware); // Verify JWT token
router.use(checkRole(["ADMIN"])); // Ensure user is admin

router.post("/", CreateCategoryController);
router.patch("/:id", UpdateCategoryController);
router.delete("/:id", DeleteCategoryController);

export default router;