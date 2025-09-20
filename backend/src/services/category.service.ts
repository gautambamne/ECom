import type { Category, Prisma } from "../generated/prisma";
import { CategoryRepository } from "../repositories/category.repositories";
import { ApiError } from "../advices/ApiError";
import { type z } from "zod";

type CategoryWithCount = Category & {
  _count?: {
    products: number;
  };
};
import { type CreateCategorySchema, type GetCategoryQuerySchema } from "../schema/category.schema";
import { RedisService } from "./redis.service";

const CACHE_OPTIONS = { ttl: 60 * 60 }; // 1 hour
const CACHE_KEY_PREFIX = "category:";
const CACHE_LIST_PREFIX = "categories:";

export class CategoryService {
  private static async invalidateCategoryCache(id?: string): Promise<void> {
    try {
      const promises: Promise<void>[] = [];
      
      // Always invalidate list cache as it affects all category lists
      const listCachePattern = `${CACHE_LIST_PREFIX}*`;
      promises.push(RedisService.delete(listCachePattern));

      // If specific category, invalidate its cache too
      if (id) {
        promises.push(RedisService.delete(`${CACHE_KEY_PREFIX}${id}`));
      }

      await Promise.all(promises);
    } catch (error) {
      console.error('Cache invalidation error:', error);
      // Don't throw - cache errors shouldn't break the main flow
    }
  }

  static async createCategory(data: z.infer<typeof CreateCategorySchema>): Promise<Category> {
    // Check if category with same name exists
    const existingCategory = await CategoryRepository.getCategoryByName(data.name);
    if (existingCategory) {
      throw new ApiError(400, "Category with this name already exists");
    }

    const category = await CategoryRepository.createCategory(data);
    
    // Invalidate categories cache
    await this.invalidateCategoryCache();
    
    return category;
  }

  static async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    // Check if category exists
    const category = await CategoryRepository.getCategoryById(id);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    // Check if new name conflicts with existing category
    if (data.name) {
      const existingCategory = await CategoryRepository.getCategoryByName(data.name);
      if (existingCategory && existingCategory.id !== id) {
        throw new ApiError(400, "Category with this name already exists");
      }
    }

    const updatedCategory = await CategoryRepository.updateCategory(id, data);
    
    // Invalidate caches
    await this.invalidateCategoryCache(id);

    return updatedCategory;
  }

  static async deleteCategory(id: string): Promise<boolean> {
    // Check if category exists
    const category = await CategoryRepository.getCategoryById(id) as CategoryWithCount;
    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    // Check if category has products
    if ((category._count?.products ?? 0) > 0) {
      throw new ApiError(400, "Cannot delete category with associated products");
    }

    const result = await CategoryRepository.deleteCategory(id);
    if (!result) {
      throw new ApiError(400, "Failed to delete category");
    }
    
    // Invalidate caches
    await this.invalidateCategoryCache(id);

    return true;
  }

  static async getCategory(id: string): Promise<Category> {
    // Try to get from cache
    const cacheKey = `${CACHE_KEY_PREFIX}${id}`;
    const cachedCategory = await RedisService.get<Category>(cacheKey);
    if (cachedCategory) {
      return cachedCategory;
    }

    const category = await CategoryRepository.getCategoryById(id);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    try {
      // Cache category
      await RedisService.set(cacheKey, category, CACHE_OPTIONS);
    } catch (error) {
      console.error('Cache set error:', error);
      // Don't throw - cache errors shouldn't break the main flow
    }

    return category;
  }

  static async getCategories(query: z.infer<typeof GetCategoryQuerySchema>): Promise<{
    categories: Category[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const cacheKey = `${CACHE_LIST_PREFIX}${JSON.stringify(query)}`;
    
    // Try to get from cache
    try {
      const cachedResult = await RedisService.get<{
        categories: Category[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      }>(cacheKey);
      if (cachedResult) {
        return cachedResult;
      }
    } catch (error) {
      console.error('Cache get error:', error);
      // Continue with database query if cache fails
    }

    const { categories, total } = await CategoryRepository.getCategories(skip, limit, search);
    const result = {
      categories,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

    try {
      // Cache results
      await RedisService.set(cacheKey, result, CACHE_OPTIONS);
    } catch (error) {
      console.error('Cache set error:', error);
      // Don't throw - cache errors shouldn't break the main flow
    }

    return result;
  }
}