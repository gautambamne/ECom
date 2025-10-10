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

  // Include the files in the validation data
  const validationData = {
    ...req.body,
    images: req.files
  };

  const result = CreateProductSchema.safeParse(validationData);
  if (!result.success) {
    throw new ApiError(400, "Validation Error", zodErrorFormatter(result.error));
  }

  let imageUrls: string[] = [];
  let imagePublicIds: string[] = [];

  // Handle multiple image uploads if files are provided
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    try {
      const cloudinaryService = CloudinaryService.getInstance();
      
      // Upload all images in parallel with high quality settings
      const uploadPromises = req.files.map(file => 
        cloudinaryService.uploadImage(file.buffer, {
          folder: 'products',
          transformation: {
            width: 1200,
            height: 1200,
            crop: 'limit', // Limit instead of fill to preserve aspect ratio
            quality: 90, // High quality (90 out of 100)
            fetch_format: 'auto' // Let Cloudinary choose best format
          }
        })
      );

      const uploadResults = await Promise.all(uploadPromises);
      
      imageUrls = uploadResults.map(result => result.secure_url);
      imagePublicIds = uploadResults.map(result => result.public_id);

      console.log(`${imageUrls.length} images uploaded successfully`);
    } catch (error: any) {
      console.error('Image upload failed:', error);
      throw new ApiError(500, `Failed to upload product images: ${error.message}`);
    }
  }

  // Create product with image URLs
  const productData = {
    ...result.data,
    ...(imageUrls.length > 0 && { images: imageUrls })
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

  // Include the files in the validation data
  const validationData = {
    ...req.body,
    images: req.files
  };

  const updateResult = UpdateProductSchema.safeParse(validationData);
  if (!updateResult.success) {
    throw new ApiError(400, "Validation Error", zodErrorFormatter(updateResult.error));
  }

  let imageUrls: string[] = [];
  let imagePublicIds: string[] = [];

  // Handle multiple image uploads if new files are provided
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
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
      
      // Upload new images in parallel with high quality settings
      const uploadPromises = req.files.map(file => 
        cloudinaryService.uploadImage(file.buffer, {
          folder: 'products',
          transformation: {
            width: 1200,
            height: 1200,
            crop: 'limit', // Limit instead of fill to preserve aspect ratio
            quality: 90, // High quality (90 out of 100)
            fetch_format: 'auto' // Let Cloudinary choose best format
          }
        })
      );

      const uploadResults = await Promise.all(uploadPromises);
      
      imageUrls = uploadResults.map(result => result.secure_url);
      imagePublicIds = uploadResults.map(result => result.public_id);

      console.log(`${imageUrls.length} new images uploaded successfully`);
    } catch (error: any) {
      console.error('Image upload failed:', error);
      throw new ApiError(500, `Failed to upload product images: ${error.message}`);
    }
  }

  // Prepare update data
  const updateData = {
    ...updateResult.data,
    ...(imageUrls.length > 0 && { images: imageUrls })
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


export const GetProductByIdController = asyncHandler(async (req: Request, res: Response) => {
  const result = GetProductSchema.safeParse({ id: req.params.id });
  if (!result.success) {
    throw new ApiError(400, "Validation Error", zodErrorFormatter(result.error));
  }

  const product = await ProductService.getProduct(result.data.id);

  return res.status(200).json(
    new ApiResponse({
      success: true,
      message: "Product fetched successfully",
      data: product
    })
  );
});


export const GetProductsController = asyncHandler(async (req: Request, res: Response) => {
  const result = GetProductQuerySchema.safeParse(req.query);
  if (!result.success) {
    throw new ApiError(400, "Validation Error", zodErrorFormatter(result.error));
  }

  const { products, pagination } = await ProductService.getProducts(result.data);

  return res.status(200).json(
    new ApiResponse({
      success: true,
      message: "Products fetched successfully",
      data: {
        products,
        pagination
      }
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

  return res.status(200).json(
    new ApiResponse({
      success: true,
      message: "Vendor products fetched successfully",
      data: {
        products,
        pagination
      }
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

  return res.status(200).json(
    new ApiResponse({
      success: true,
      message: "Category products fetched successfully",
      data: {
        products,
        pagination
      }
    })
  );
});
