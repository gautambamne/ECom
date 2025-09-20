import { prisma } from "../db/connectDb";
import type { Category, Prisma } from "../generated/prisma";

export const CategoryRepository = {
  createCategory: async (data: Prisma.CategoryCreateInput): Promise<Category> => {
    return await prisma.category.create({ 
      data,
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });
  },

  getCategoryById: async (id: string): Promise<Category | null> => {
    return await prisma.category.findUnique({ 
      where: { id },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });
  },

  getCategoryByName: async (name: string): Promise<Category | null> => {
    return await prisma.category.findUnique({ 
      where: { name },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });
  },

  getCategories: async (skip = 0, take = 10, search?: string): Promise<{ 
    categories: Category[]; 
    total: number; 
  }> => {
    const where = search ? {
      name: {
        contains: search,
        mode: "insensitive" as const,
      },
    } : {};

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take,
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: {
              products: true
            }
          }
        }
      }),
      prisma.category.count({ where })
    ]);

    return { categories, total };
  },

  updateCategory: async (id: string, data: Prisma.CategoryUpdateInput): Promise<Category> => {
    return await prisma.category.update({ 
      where: { id },
      data,
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });
  },

  deleteCategory: async (id: string): Promise<boolean> => {
    try {
      await prisma.category.delete({ where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  },
};
