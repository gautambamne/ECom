import { z, infer as zodInfer } from 'zod';
// import { ShoeColor, ShoeSize } from "../generated/prisma";

// Define enums directly since the generated prisma types might not be available
enum ShoeSize {
  UK6 = "UK6",
  UK7 = "UK7", 
  UK8 = "UK8",
  UK9 = "UK9",
  UK10 = "UK10",
  UK11 = "UK11"
}

enum ShoeColor {
  RED = "RED",
  BLACK = "BLACK",
  WHITE = "WHITE", 
  BLUE = "BLUE",
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  GREY = "GREY"
}

// Enum schemas
const ShoeSizeSchema = z.nativeEnum(ShoeSize);
const ShoeColorSchema = z.nativeEnum(ShoeColor);

// Variant Schema
const ProductVariantSchema = z.object({
  size: ShoeSizeSchema,
  color: ShoeColorSchema,
  stock: z.number().int().nonnegative().default(0),
});

// Create Product Schema
const CreateProductSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  brand: z.string().optional(),
  price: z.preprocess(
    (val) => val === "" ? undefined : Number(val),
    z.number().positive("Price must be greater than 0")
  ),
  stock: z.preprocess(
    (val) => val === "" ? 0 : Number(val),
    z.number().int().nonnegative().default(0)
  ),
  categories: z.preprocess(
    (val) => {
      if (!val) return [];
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return val.split(',').map(s => s.trim());
        }
      }
      return val;
    },
    z.array(z.string().uuid("Invalid category id")).optional()
  ),
  variants: z.preprocess(
    (val) => {
      if (!val) return [];
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return [];
        }
      }
      return val;
    },
    z.array(ProductVariantSchema).min(1, "At least one variant is required")
  ),
  // Note: image field is handled by multer middleware and not validated here
  // The actual file validation happens in the multer middleware
  image: z.any().optional(), // This will be populated by multer
  images: z.array(z.string().url()).optional(), // Array of image URLs for database storage
});

// Update Product Schema
const UpdateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  brand: z.string().optional(),
  price: z.preprocess(
    (val) => val === "" ? undefined : Number(val),
    z.number().positive("Price must be greater than 0").optional()
  ),
  stock: z.preprocess(
    (val) => val === "" ? undefined : Number(val),
    z.number().int().nonnegative().optional()
  ),
  categories: z.preprocess(
    (val) => {
      if (!val) return undefined;
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return val.split(',').map(s => s.trim());
        }
      }
      return val;
    },
    z.array(z.string().uuid("Invalid category id")).optional()
  ),
  variants: z.preprocess(
    (val) => {
      if (!val) return undefined;
      if (typeof val === 'string') {
        try {
          return JSON.parse(val);
        } catch {
          return undefined;
        }
      }
      return val;
    },
    z.array(ProductVariantSchema).optional()
  ),
  // Note: image field is handled by multer middleware and not validated here
  image: z.any().optional(), // This will be populated by multer
  images: z.array(z.string().url()).optional(), // Array of image URLs for database storage
});

const DeleteProductSchema = z.object({
  id: z.string().uuid("Invalid product id"),
});

const GetProductSchema = z.object({
  id: z.string().uuid("Invalid product id"),
});

const GetProductQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  category: z.string().uuid().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  size: ShoeSizeSchema.optional(),
  color: ShoeColorSchema.optional(),
});

// Type inference
type IProductVariantSchema = zodInfer<typeof ProductVariantSchema>;
type ICreateProductSchema = zodInfer<typeof CreateProductSchema>;
type IUpdateProductSchema = zodInfer<typeof UpdateProductSchema>;
type IDeleteProductSchema = zodInfer<typeof DeleteProductSchema>;
type IGetProductSchema = zodInfer<typeof GetProductSchema>;
type IProductsQuerySchema = zodInfer<typeof GetProductQuerySchema>;

export type {
    IProductVariantSchema,
    ICreateProductSchema,
    IUpdateProductSchema,
    IDeleteProductSchema,
    IGetProductSchema,
    IProductsQuerySchema
}

export {
    ShoeSizeSchema,
    ShoeColorSchema,
    ProductVariantSchema,
    CreateProductSchema,
    UpdateProductSchema,
    DeleteProductSchema,
    GetProductSchema,
    GetProductQuerySchema
}