import { z, infer as zodInfer } from 'zod';

const UpdateProfileSchema = z.object({
    name: z.string()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name must be at most 50 characters long")
});

const UpdatePasswordSchema = z.object({
    currentPassword: z.string()
        .min(6, "Current password must be at least 6 characters long"),
    newPassword: z.string()
        .min(6, "New password must be at least 6 characters long")
});

type IUpdateProfileSchema = zodInfer<typeof UpdateProfileSchema>;
type IUpdatePasswordSchema = zodInfer<typeof UpdatePasswordSchema>;

export type {
    IUpdateProfileSchema,
    IUpdatePasswordSchema
}

export {
    UpdateProfileSchema,
    UpdatePasswordSchema
};