import { type Request, type Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiResponse } from "../advices/ApiResponse";
import { ApiError } from "../advices/ApiError";
import { CategoryService } from "../services/category.service";
import {
  CreateCategorySchema,
  DeleteCategorySchema,
  GetCategoryQuerySchema,
  GetCategorySchema,
  UpdateCategorySchema,
} from "../schema/category.schema";
import { zodErrorFormatter } from "../utils/format-validation-error";

export const CreateCategoryController = asyncHandler(async (req: Request, res: Response) => {
  const result = CreateCategorySchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400, "Validation Error", zodErrorFormatter(result.error));
  }

  const category = await CategoryService.createCategory(result.data);

  return res.status(201).json(
    new ApiResponse({
      category,
      message: "Category created successfully"
    })
  );
});

export const UpdateCategoryController = asyncHandler(async (req: Request, res: Response) => {
  const idResult = GetCategorySchema.safeParse({ id: req.params.id });
  if (!idResult.success) {
    throw new ApiError(400, "Validation Error", zodErrorFormatter(idResult.error));
  }

  const updateResult = UpdateCategorySchema.safeParse(req.body);
  if (!updateResult.success) {
    throw new ApiError(400, "Validation Error", zodErrorFormatter(updateResult.error));
  }

  const category = await CategoryService.updateCategory(
    idResult.data.id,
    updateResult.data
  );

  return res.status(200).json(
    new ApiResponse({
      category,
      message: "Category updated successfully"
    })
  );
});

export const DeleteCategoryController = asyncHandler(async (req: Request, res: Response) => {
  const result = DeleteCategorySchema.safeParse({ id: req.params.id });
  if (!result.success) {
    throw new ApiError(400, "Validation Error", zodErrorFormatter(result.error));
  }

  await CategoryService.deleteCategory(result.data.id);

  return res.status(200).json(
    new ApiResponse({
      message: "Category deleted successfully"
    })
  );
});

export const GetCategoryController = asyncHandler(async (req: Request, res: Response) => {
  const result = GetCategorySchema.safeParse({ id: req.params.id });
  if (!result.success) {
    throw new ApiError(400, "Validation Error", zodErrorFormatter(result.error));
  }

  const category = await CategoryService.getCategory(result.data.id);

  return res.status(200).json(
    new ApiResponse({
      category
    })
  );
});

export const GetCategoriesController = asyncHandler(async (req: Request, res: Response) => {
  const result = GetCategoryQuerySchema.safeParse(req.query);
  if (!result.success) {
    throw new ApiError(400, "Validation Error", zodErrorFormatter(result.error));
  }

  const { categories, pagination } = await CategoryService.getCategories(result.data);

  return res.status(200).json(
    new ApiResponse({
      categories,
      pagination
    })
  );
});