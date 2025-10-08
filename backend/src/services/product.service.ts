import { Prisma } from "../generated/prisma";
import { ProductRepository } from "../repositories/product.repositories";
import { ApiError } from "../advices/ApiError";
import { CreateProductSchema, UpdateProductSchema, GetProductQuerySchema } from "../schema/product.schema";
import type { z } from "zod";

interface ProductSummary {
    total_stock: number;
    available_variants: number;
    average_rating?: number;
    total_reviews?: number;
    discount_percentage?: number;
    is_on_sale: boolean;
    currency: string;
}

interface FormattedProduct {
    product_id: number;
    name: string;
    description?: string;
    brand?: string;
    category: string;
    images: string[];
    price: number;
    discount_price?: number | null;
    stock: number;
    variants: {
        size: string;
        color: string;
        stock: number;
        available: boolean;
    }[];
    vendor: {
        id: string;
        name: string;
        email: string;
    };
    summary: ProductSummary;
    in_stock: boolean;
    is_active: boolean;
    currency: string;
    created_at: string;
    updated_at: string;
}

export const ProductService = {
    // Format product for API response
    formatProductResponse(product: any): FormattedProduct {
        const totalStock = product.variants?.reduce((sum: number, variant: any) => sum + variant.stock, 0) || product.stock;
        const availableVariants = product.variants?.filter((v: any) => v.stock > 0).length || 0;
        
        const discountPercentage = product.discount_price 
            ? Math.round(((product.price - product.discount_price) / product.price) * 100)
            : undefined;

        return {
            product_id: Math.abs(product.id.split('-').join('').slice(0, 8).split('').reduce((a: number, b: string) => ((a << 5) - a) + b.charCodeAt(0), 0)),
            name: product.name,
            description: product.description,
            brand: product.brand,
            category: product.categories?.[0]?.name || "Uncategorized",
            images: product.images || [],
            price: product.price,
            discount_price: product.discount_price,
            stock: totalStock,
            variants: product.variants?.map((variant: any) => ({
                size: variant.size,
                color: variant.color,
                stock: variant.stock,
                available: variant.stock > 0
            })) || [],
            vendor: {
                id: product.vendor?.id || product.vendor_id,
                name: product.vendor?.name || "Unknown Vendor",
                email: product.vendor?.email || ""
            },
            summary: {
                total_stock: totalStock,
                available_variants: availableVariants,
                discount_percentage: discountPercentage,
                is_on_sale: !!product.discount_price,
                currency: product.currency || "INR"
            },
            in_stock: totalStock > 0,
            is_active: product.is_active !== false,
            currency: product.currency || "INR",
            created_at: product.created_at?.toISOString() || new Date().toISOString(),
            updated_at: product.updated_at?.toISOString() || new Date().toISOString()
        };
    },

    // Calculate stock across all variants
    calculateTotalStock(variants: any[]): number {
        return variants?.reduce((total, variant) => total + variant.stock, 0) || 0;
    },

    // Validate stock availability
    async validateProductStock(productId: string, requestedQuantity: number): Promise<{ available: boolean; maxAvailable: number }> {
        const product = await ProductRepository.getProductById(productId);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        // For now, use the main product stock until we enhance the repository to include variants
        const totalStock = product.stock;
        
        return {
            available: totalStock >= requestedQuantity,
            maxAvailable: totalStock
        };
    },
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

    async getProduct(id: string): Promise<FormattedProduct> {
        const product = await ProductRepository.getProductById(id);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }
        
        // For now, format with the basic product data
        // We'll enhance this when we update the repository
        return this.formatProductResponse(product);
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
            products: products.map(product => this.formatProductResponse(product)),
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
            products: products.map(product => this.formatProductResponse(product)),
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
            products: products.map(product => this.formatProductResponse(product)),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    // Search products with advanced filtering
    async searchProducts(query: z.infer<typeof GetProductQuerySchema>) {
        const result = await this.getProducts(query);
        return result;
    },

    // Get featured products
    async getFeaturedProducts(limit: number = 10) {
        const { products } = await ProductRepository.getProducts({
            take: limit,
            where: { is_active: true },
            orderBy: { created_at: 'desc' }
        });

        return products.map(product => this.formatProductResponse(product));
    },

    // Get products on sale
    async getProductsOnSale(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const { products, total } = await ProductRepository.getProducts({
            skip,
            take: limit,
            where: { 
                is_active: true,
                discount_price: { not: null }
            },
            orderBy: { created_at: 'desc' }
        });

        return {
            products: products.map(product => this.formatProductResponse(product)),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
};
