import { type Request, type Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiResponse } from "../advices/ApiResponse";
import { ApiError } from "../advices/ApiError";
import { ProductService } from "../services/product.service";
import { CloudinaryService } from "../services/cloudinary.service";
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

  // // Log the incoming request for debugging
  // console.log('Create Product Request:', {
  //   hasFile: !!req.file,
  //   fileInfo: req.file ? {
  //     fieldname: req.file.fieldname,
  //     mimetype: req.file.mimetype,
  //     size: req.file.size,
  //     hasBuffer: !!req.file.buffer
  //   } : null,
  //   bodyKeys: Object.keys(req.body)
  // });

  // Include the file in the validation data
  const validationData = {
    ...req.body,
    image: req.file
  };

  const result = CreateProductSchema.safeParse(validationData);
  if (!result.success) {
    throw new ApiError(400, "Validation Error", zodErrorFormatter(result.error));
  }

  let imageUrl: string | undefined;
  let imagePublicId: string | undefined;

  // Handle image upload if file is provided
  if (req.file?.buffer) {
    try {
      const cloudinaryService = CloudinaryService.getInstance();
      const uploadResult = await cloudinaryService.uploadImage(req.file.buffer, {
        folder: 'products',
        transformation: {
          width: 800,
          height: 600,
          crop: 'fill',
          quality: 'auto',
          format: 'webp'
        }
      });

      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;

      console.log('Image uploaded successfully:');
    } catch (error: any) {
      console.error('Image upload failed:', error);
      throw new ApiError(500, `Failed to upload product image: ${error.message}`);
    }
  }

  // Create product with image URL
  const productData = {
    ...result.data,
    ...(imageUrl && { images: [imageUrl] })
  };

  const product = await ProductService.createProduct(productData, vendorId);
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

  // Include the file in the validation data
  const validationData = {
    ...req.body,
    image: req.file
  };

  const updateResult = UpdateProductSchema.safeParse(validationData);
  if (!updateResult.success) {
    throw new ApiError(400, "Validation Error", zodErrorFormatter(updateResult.error));
  }

  let imageUrl: string | undefined;
  let imagePublicId: string | undefined;

  // Handle image upload if new file is provided
  if (req.file?.buffer) {
    try {
      const cloudinaryService = CloudinaryService.getInstance();
      
      // Get existing product to delete old images
      const existingProduct = await ProductService.getProduct(idResult.data.id);
      
      // Delete old images if exists
      if (existingProduct?.images && existingProduct.images.length > 0) {
        try {
          for (const imageUrl of existingProduct.images) {
            const publicId = cloudinaryService.extractPublicId(imageUrl);
            if (publicId) {
              await cloudinaryService.deleteImage(publicId);
              console.log('Old image deleted:', publicId);
            }
          }
        } catch (error) {
          console.error('Failed to delete old images:', error);
          // Continue with update even if delete fails
        }
      }
      
      // Upload new image
      const uploadResult = await cloudinaryService.uploadImage(req.file.buffer, {
        folder: 'products',
        transformation: {
          width: 800,
          height: 600,
          crop: 'fill',
          quality: 'auto',
          format: 'webp'
        }
      });

      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;

      console.log('New image uploaded successfully:', {
        url: imageUrl,
        publicId: imagePublicId,
        size: uploadResult.bytes
      });
    } catch (error: any) {
      console.error('Image upload failed:', error);
      throw new ApiError(500, `Failed to upload product image: ${error.message}`);
    }
  }

  // Prepare update data
  const updateData = {
    ...updateResult.data,
    ...(imageUrl && { images: [imageUrl] })
  };

  const product = await ProductService.updateProduct(
    idResult.data.id,
    updateData,
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

  // Get product to delete associated images
  const product = await ProductService.getProduct(result.data.id);
  
  // Delete images from Cloudinary before deleting product
  if (product?.images && product.images.length > 0) {
    try {
      const cloudinaryService = CloudinaryService.getInstance();
      for (const imageUrl of product.images) {
        const publicId = cloudinaryService.extractPublicId(imageUrl);
        if (publicId) {
          await cloudinaryService.deleteImage(publicId);
          console.log('Product image deleted from Cloudinary:', publicId);
        }
      }
    } catch (error) {
      console.error('Failed to delete product images from Cloudinary:', error);
      // Continue with product deletion even if image deletion fails
    }
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
  const vendorId = req.user?.id;
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
