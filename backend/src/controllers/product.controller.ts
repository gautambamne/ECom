import { type Request, type Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiResponse } from "../advices/ApiResponse";
import { ApiError } from "../advices/ApiError";
import { ProductService } from "../services/product.service";
import {
  CreateProductSchema,
  DeleteProductSchema,
  GetProductQuerySchema,
  GetProductSchema,
  UpdateProductSchema,
} from "../schema/product.schema";
import { zodErrorFormatter } from "../utils/format-validation-error";


// Helper function to sanitize product data
const sanitizeProduct = (product: any) => {
  const { vendor, ...sanitizedProduct } = product;
  return {
    ...sanitizedProduct,
    vendor: vendor ? {
      id: vendor.id,
      name: vendor.name,
      email: vendor.email
    } : undefined
  };
};

export const CreateProductController = asyncHandler(async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  if (!vendorId) {
    throw new Error("User ID not found in request");
  }

  const result = CreateProductSchema.safeParse(req.body);
  if (!result.success) {
    throw new ApiError(400,"validation Error",zodErrorFormatter(result.error))
  }

  const product = await ProductService.createProduct(result.data, vendorId);
  const sanitizedProduct = sanitizeProduct(product);

  return res.status(201).json(
    new ApiResponse({
      product: sanitizedProduct,
      message: "Product created successfully"
    })
  );
});

export const UpdateProductController = asyncHandler(async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  if (!vendorId) {
    throw new Error("User ID not found in request");
  }

  const idResult = GetProductSchema.safeParse({ id: req.params.id });
  if (!idResult.success) {
    throw new ApiError(400, "Validation Error", zodErrorFormatter(idResult.error));
  }

  const updateResult = UpdateProductSchema.safeParse(req.body);
  if (!updateResult.success) {
    throw new ApiError(400, "Validation Error", zodErrorFormatter(updateResult.error));
  }

  const product = await ProductService.updateProduct(
    idResult.data.id,
    updateResult.data,
    vendorId
  );
  const sanitizedProduct = sanitizeProduct(product);

  return res.status(200).json(
    new ApiResponse({
      product: sanitizedProduct,
      message: "Product updated successfully"
    })
  );
});

export const DeleteProductController = asyncHandler(async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  if (!vendorId) {
    throw new Error("User ID not found in request");
  }

  const result = DeleteProductSchema.safeParse({ id: req.params.id });
  if (!result.success) {
    throw new ApiError(400, "Validation Error", zodErrorFormatter(result.error));
  }

  await ProductService.deleteProduct(result.data.id, vendorId);

  return res.status(200).json(
    new ApiResponse({
      message: "Product deleted successfully"
    })
  );
});

export const GetProductController = asyncHandler(async (req: Request, res: Response) => {
  const result = GetProductSchema.safeParse({ id: req.params.id });
  if (!result.success) {
    throw new ApiError(400, "Validation Error", zodErrorFormatter(result.error));
  }

  const product = await ProductService.getProduct(result.data.id);
  const sanitizedProduct = sanitizeProduct(product);

  return res.status(200).json(
    new ApiResponse({
      product: sanitizedProduct
    })
  );
});

export const GetProductsController = asyncHandler(async (req: Request, res: Response) => {
  const result = GetProductQuerySchema.safeParse(req.query);
  if (!result.success) {
    throw new ApiError(400, "Validation Error", zodErrorFormatter(result.error));
  }

  const { products, pagination } = await ProductService.getProducts(result.data);
  const sanitizedProducts = products.map(sanitizeProduct);

  return res.status(200).json(
    new ApiResponse({
      products: sanitizedProducts,
      pagination
    })
  );
});

export const GetVendorProductsController = asyncHandler(async (req: Request, res: Response) => {
  const vendorId = req.params.vendorId || req.user?.id;
  if (!vendorId) {
    throw new Error("Vendor ID not found");
  }

  const queryResult = GetProductQuerySchema.safeParse(req.query);
  if (!queryResult.success) {
    throw new ApiError(400, "Validation Error", zodErrorFormatter(queryResult.error));
  }

  const { products, pagination } = await ProductService.getVendorProducts(
    vendorId,
    queryResult.data
  );
  const sanitizedProducts = products.map(sanitizeProduct);

  return res.status(200).json(
    new ApiResponse({
      products: sanitizedProducts,
      pagination
    })
  );
});

export const GetProductsByCategoryController = asyncHandler(async (req: Request, res: Response) => {
  const result = GetProductSchema.safeParse({ id: req.params.categoryId });
  if (!result.success) {
    throw new ApiError(400, "Validation Error", zodErrorFormatter(result.error));
  }

  const queryResult = GetProductQuerySchema.safeParse(req.query);
  if (!queryResult.success) {
    throw new ApiError(400, "Validation Error", zodErrorFormatter(queryResult.error));
  }

  const { products, pagination } = await ProductService.getProductsByCategory(
    result.data.id,
    queryResult.data
  );
  const sanitizedProducts = products.map(sanitizeProduct);

  return res.status(200).json(
    new ApiResponse({
      products: sanitizedProducts,
      pagination
    })
  );
});
