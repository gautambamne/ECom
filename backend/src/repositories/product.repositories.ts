import { prisma } from "../db/connectDb";
import { Prisma, type Product, type ProductVariant } from "../generated/prisma";
import { RedisService } from "../services/redis.service";

export const ProductRepository = {
    // Create a new product with variants
    createProduct: async(data: Prisma.ProductCreateInput): Promise<Product> => {
        const product = await prisma.product.create({
            data,
            include: {
                variants: true,
                categories: true
            }
        });
        
        // Cache the product
        await RedisService.set(`product:${product.id}`, product);
        return product;
    },

    // Get product by ID with all relations
    getProductById: async(id: string): Promise<Product | null> => {
        // Try cache first
        const cacheKey = `product:${id}`;
        const cachedProduct = await RedisService.getAndRefresh<Product>(cacheKey);

        if (cachedProduct) {
            return cachedProduct;
        }

        // If not in cache, get from database with all relations
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                variants: true,
                categories: true,
                vendor: true
            }
        });

        if (product) {
            await RedisService.set(cacheKey, product);
        }

        return product;
    },

    // Get all products with pagination and filters
    getProducts: async(params: {
        skip?: number;
        take?: number;
        where?: Prisma.ProductWhereInput;
        orderBy?: Prisma.ProductOrderByWithRelationInput;
    }) => {
        const { skip, take, where, orderBy } = params;

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                skip,
                take,
                where,
                orderBy,
                include: {
                    variants: true,
                    categories: true,
                    vendor: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }),
            prisma.product.count({ where })
        ]);

        return { products, total };
    },

    // Update product by ID
    updateProductById: async(id: string, data: Prisma.ProductUpdateInput): Promise<Product> => {
        const product = await prisma.product.update({
            where: { id },
            data,
            include: {
                variants: true,
                categories: true
            }
        });

        // Update cache
        await RedisService.set(`product:${product.id}`, product);
        return product;
    },

    // Delete product by ID
    deleteProductById: async(id: string): Promise<boolean> => {
        try {
            await prisma.product.delete({ where: { id } });
            // Remove from cache
            await RedisService.delete(`product:${id}`);
            return true;
        } catch (error) {
            return false;
        }
    },

    // Product Variant Operations
    createVariant: async(data: Prisma.ProductVariantCreateInput): Promise<ProductVariant> => {
        const variant = await prisma.productVariant.create({ data });
        // Invalidate product cache to force refresh
        await RedisService.delete(`product:${variant.product_id}`);
        return variant;
    },

    updateVariant: async(id: string, data: Prisma.ProductVariantUpdateInput): Promise<ProductVariant> => {
        const variant = await prisma.productVariant.update({
            where: { id },
            data
        });
        // Invalidate product cache to force refresh
        await RedisService.delete(`product:${variant.product_id}`);
        return variant;
    },

    deleteVariant: async(id: string): Promise<boolean> => {
        try {
            const variant = await prisma.productVariant.delete({ where: { id } });
            // Invalidate product cache to force refresh
            await RedisService.delete(`product:${variant.product_id}`);
            return true;
        } catch (error) {
            return false;
        }
    },

    // Category-specific operations
    getProductsByCategory: async(categoryId: string, params: {
        skip?: number;
        take?: number;
        orderBy?: Prisma.ProductOrderByWithRelationInput;
    }) => {
        const { skip, take, orderBy } = params;

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where: {
                    categories: {
                        some: {
                            id: categoryId
                        }
                    }
                },
                skip,
                take,
                orderBy,
                include: {
                    variants: true,
                    categories: true,
                    vendor: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                }
            }),
            prisma.product.count({
                where: {
                    categories: {
                        some: {
                            id: categoryId
                        }
                    }
                }
            })
        ]);

        return { products, total };
    },

    // Update product stock
    updateProductStock: async(productId: string, newStock: number): Promise<Product> => {
        const product = await prisma.product.update({
            where: { id: productId },
            data: { stock: newStock },
            include: {
                variants: true,
                categories: true,
                vendor: true
            }
        });

        // Update cache
        const cacheKey = `product:${productId}`;
        await RedisService.set(cacheKey, product);

        return product;
    },

    // Check if products have sufficient stock
    checkProductsStock: async(productIds: string[]): Promise<{ [key: string]: number }> => {
        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds
                }
            },
            select: {
                id: true,
                stock: true
            }
        });

        return products.reduce((acc, product) => {
            acc[product.id] = product.stock;
            return acc;
        }, {} as { [key: string]: number });
    },

    // Get product with relations (for services)
    getProductWithRelations: async(id: string): Promise<Product & {
        variants: ProductVariant[];
        categories: { id: string; name: string }[];
        vendor: { id: string; name: string; email: string };
    } | null> => {
        return await prisma.product.findUnique({
            where: { id },
            include: {
                variants: true,
                categories: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                vendor: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    },

    // Vendor-specific operations
    getProductsByVendor: async(vendorId: string, params: {
        skip?: number;
        take?: number;
        orderBy?: Prisma.ProductOrderByWithRelationInput;
    }) => {
        const { skip, take, orderBy } = params;

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where: { vendor_id: vendorId },
                skip,
                take,
                orderBy,
                include: {
                    variants: true,
                    categories: true
                }
            }),
            prisma.product.count({
                where: { vendor_id: vendorId }
            })
        ]);

        return { products, total };
    }
};
