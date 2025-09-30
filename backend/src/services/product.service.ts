import { Prisma } from "../generated/prisma";
import { ProductRepository } from "../repositories/product.repositories";
import { ApiError } from "../advices/ApiError";
import { CreateProductSchema, UpdateProductSchema, GetProductQuerySchema } from "../schema/product.schema";
import type { z } from "zod";

export const ProductService = {
    async createProduct(
        input: z.infer<typeof CreateProductSchema>,
        vendorId: string
    ) {
        // Validate input using zod schema
        const result = CreateProductSchema.safeParse(input);
        if (!result.success) {
            throw new ApiError(400, "Validation failed", 
                Object.fromEntries(
                    Object.entries(result.error.flatten().fieldErrors)
                    .map(([key, errors]) => [key, errors?.join(", ") || "Invalid input"])
                )
            );
        }

        try {
            // Prepare variants data
            const variants = input.variants.map(variant => ({
                size: variant.size,
                color: variant.color,
                stock: variant.stock
            }));

            // Prepare categories connection
            const categories = input.categories ? {
                connect: input.categories.map(id => ({ id }))
            } : undefined;

            // Create product with all relations
            const product = await ProductRepository.createProduct({
                name: input.name,
                description: input.description,
                brand: input.brand,
                price: input.price,
                stock: input.stock,
                // Handle images - convert single image to array or use provided images array
                images: (input as any).images || [], 
                vendor: {
                    connect: { id: vendorId }
                },
                categories,
                variants: {
                    create: variants
                }
            });

            return product;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ApiError(400, "Product with this name already exists");
                }
                if (error.code === 'P2025') {
                    throw new ApiError(404, "Vendor or category not found");
                }
            }
            throw error;
        }
    },

    async updateProduct(
        id: string,
        input: z.infer<typeof UpdateProductSchema>,
        vendorId: string
    ) {
        // Validate input
        const result = UpdateProductSchema.safeParse(input);
        if (!result.success) {
            throw new ApiError(400, "Validation failed", 
                Object.fromEntries(
                    Object.entries(result.error.flatten().fieldErrors)
                    .map(([key, errors]) => [key, errors?.join(", ") || "Invalid input"])
                )
            );
        }

        // Check if product exists and belongs to vendor
        const existingProduct = await ProductRepository.getProductById(id);
        if (!existingProduct) {
            throw new ApiError(404, "Product not found");
        }
        if (existingProduct.vendor_id !== vendorId) {
            throw new ApiError(403, "Not authorized to update this product");
        }

        try {
            // Prepare categories update if provided
            const categories = input.categories ? {
                set: input.categories.map(id => ({ id }))
            } : undefined;

            // Prepare variants update if provided
            const variants = input.variants ? {
                deleteMany: {},
                create: input.variants
            } : undefined;

            // Update product with all relations
            const product = await ProductRepository.updateProductById(id, {
                name: input.name,
                description: input.description,
                brand: input.brand,
                price: input.price,
                stock: input.stock,
                // Handle images update if provided
                ...((input as any).images && { images: (input as any).images }),
                categories,
                variants
            });

            return product;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ApiError(400, "Product with this name already exists");
                }
                if (error.code === 'P2025') {
                    throw new ApiError(404, "Category not found");
                }
            }
            throw error;
        }
    },

    async deleteProduct(id: string, vendorId: string) {
        // Check if product exists and belongs to vendor
        const product = await ProductRepository.getProductById(id);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }
        if (product.vendor_id !== vendorId) {
            throw new ApiError(403, "Not authorized to delete this product");
        }

        return await ProductRepository.deleteProductById(id);
    },

    async getProduct(id: string) {
        const product = await ProductRepository.getProductById(id);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }
        return product;
    },

    async getProducts(query: z.infer<typeof GetProductQuerySchema>) {
        // Validate query parameters
        const result = GetProductQuerySchema.safeParse(query);
        if (!result.success) {
            throw new ApiError(400, "Invalid query parameters", 
                Object.fromEntries(
                    Object.entries(result.error.flatten().fieldErrors)
                    .map(([key, errors]) => [key, errors?.join(", ") || "Invalid input"])
                )
            );
        }

        const { page, limit, search, category, minPrice, maxPrice, size, color } = query;
        const skip = (page - 1) * limit;

        // Build where clause based on filters
        const where: Prisma.ProductWhereInput = {
            AND: [
                // Search in name, description, and brand
                search ? {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                        { brand: { contains: search, mode: 'insensitive' } }
                    ]
                } : {},
                // Category filter
                category ? {
                    categories: {
                        some: { id: category }
                    }
                } : {},
                // Price range filter
                {
                    AND: [
                        minPrice ? { price: { gte: minPrice } } : {},
                        maxPrice ? { price: { lte: maxPrice } } : {}
                    ]
                },
                // Size and color filters through variants
                size || color ? {
                    variants: {
                        some: {
                            ...(size ? { size } : {}),
                            ...(color ? { color } : {})
                        }
                    }
                } : {}
            ]
        };

        // Get products with pagination and filters
        const { products, total } = await ProductRepository.getProducts({
            skip,
            take: limit,
            where,
            orderBy: { created_at: 'desc' }
        });

        return {
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    // Vendor-specific methods
    async getVendorProducts(
        vendorId: string,
        query: z.infer<typeof GetProductQuerySchema>
    ) {
        const { page, limit } = query;
        const { products, total } = await ProductRepository.getProductsByVendor(vendorId, {
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { created_at: 'desc' }
        });

        return {
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    // Category-specific methods
    async getProductsByCategory(
        categoryId: string,
        query: z.infer<typeof GetProductQuerySchema>
    ) {
        const { page, limit } = query;
        const { products, total } = await ProductRepository.getProductsByCategory(categoryId, {
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { created_at: 'desc' }
        });

        return {
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
};
