import { z, infer as zodInfer } from 'zod';


const CreateCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").max(50, "Category name cannot exceed 50 characters"),
});

const GetCategorySchema = z.object({
  id: z.string().uuid(),
});

const UpdateCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").max(50, "Category name cannot exceed 50 characters"),
});

const DeleteCategorySchema = z.object({
  id: z.string().uuid(),
});

const GetCategoryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
  search: z.string().optional(),
}).strict();

// Type inference
type ICreateCategorySchema = zodInfer<typeof CreateCategorySchema>;
type IGetCategorySchema = zodInfer<typeof GetCategorySchema>;
type IUpdateCategorySchema = zodInfer<typeof UpdateCategorySchema>;
type IDeleteCategorySchema = zodInfer<typeof DeleteCategorySchema>;
type IGetCategoryQuerySchema = zodInfer<typeof GetCategoryQuerySchema>;

export type {
    ICreateCategorySchema,
    IGetCategorySchema,
    IUpdateCategorySchema,
    IDeleteCategorySchema,
    IGetCategoryQuerySchema
}

export {
    CreateCategorySchema,
    GetCategorySchema,
    UpdateCategorySchema,
    DeleteCategorySchema,
    GetCategoryQuerySchema
}