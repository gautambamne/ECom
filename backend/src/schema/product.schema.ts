import { z } from "zod"
import { ShoeColor, ShoeSize } from "../generated/prisma";

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
  price: z
    .number()
    .positive("Price must be greater than 0"),
  stock: z.number().int().nonnegative().default(0),
  categories: z
    .array(z.string().uuid("Invalid category id"))
    .optional(),
  variants: z.array(ProductVariantSchema)
    .min(1, "At least one variant is required"), // If variants are required
});

// Update Product Schema
const UpdateProductSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  brand: z.string().optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().nonnegative().optional(),
  categories: z.array(z.string().uuid()).optional(),
  variants: z.array(ProductVariantSchema).optional(),
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