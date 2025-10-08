import { z, infer as zodInfer } from 'zod';

const CreateCategorySchema = z.object({
    name: z.string()
        .min(1, "Category name is required")
        .max(100, "Category name must be at most 100 characters"),
    description: z.string()
        .max(500, "Description must be at most 500 characters")
        .optional(),
    parent_id: z.string().optional(),
    is_active: z.boolean().default(true),
});

const UpdateCategorySchema = CreateCategorySchema.partial();

type ICreateCategorySchema = zodInfer<typeof CreateCategorySchema>;
type IUpdateCategorySchema = zodInfer<typeof UpdateCategorySchema>;

export type {
    ICreateCategorySchema,
    IUpdateCategorySchema
}

export {
    CreateCategorySchema,
    UpdateCategorySchema
};