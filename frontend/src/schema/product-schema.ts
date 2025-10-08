import { z, infer as zodInfer } from 'zod';

const CreateProductSchema = z.object({
    name: z.string()
        .min(1, "Product name is required")
        .max(200, "Product name must be at most 200 characters"),
    product_code: z.string()
        .min(1, "Product code is required")
        .max(50, "Product code must be at most 50 characters"),
    description: z.string()
        .min(10, "Description must be at least 10 characters")
        .max(2000, "Description must be at most 2000 characters"),
    price: z.number()
        .positive("Price must be positive"),
    sale_price: z.number()
        .positive("Sale price must be positive")
        .optional(),
    brand: z.string()
        .min(1, "Brand is required")
        .max(100, "Brand must be at most 100 characters"),
    sizes: z.array(z.string()).min(1, "At least one size is required"),
    colors: z.array(z.string()).min(1, "At least one color is required"),
    material: z.string()
        .min(1, "Material is required")
        .max(100, "Material must be at most 100 characters"),
    category_id: z.string()
        .min(1, "Category is required"),
    stock_quantity: z.number()
        .int("Stock quantity must be an integer")
        .min(0, "Stock quantity cannot be negative"),
    min_stock_level: z.number()
        .int("Minimum stock level must be an integer")
        .min(0, "Minimum stock level cannot be negative"),
    tags: z.array(z.string()).optional().default([]),
    meta_title: z.string()
        .max(60, "Meta title must be at most 60 characters")
        .optional(),
    meta_description: z.string()
        .max(160, "Meta description must be at most 160 characters")
        .optional(),
    is_featured: z.boolean().default(false),
    is_active: z.boolean().default(true),
    weight: z.number().positive().optional(),
    dimensions: z.string().optional(),
    care_instructions: z.string().optional(),
});

const UpdateProductSchema = CreateProductSchema.partial();

const ProductsQuerySchema = z.object({
    page: z.number().int().positive().optional(),
    limit: z.number().int().positive().max(100).optional(),
    search: z.string().optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    minPrice: z.number().positive().optional(),
    maxPrice: z.number().positive().optional(),
    featured: z.boolean().optional(),
    onSale: z.boolean().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
});

type ICreateProductSchema = zodInfer<typeof CreateProductSchema>;
type IUpdateProductSchema = zodInfer<typeof UpdateProductSchema>;
type IProductsQuerySchema = zodInfer<typeof ProductsQuerySchema>;

export type {
    ICreateProductSchema,
    IUpdateProductSchema,
    IProductsQuerySchema
}

export {
    CreateProductSchema,
    UpdateProductSchema,
    ProductsQuerySchema
};