import { z, infer as zodInfer } from 'zod';

const UpdateUserSchema = z.object({
    name: z.string()
    .min(3,"Name must be at least 3 character long")
    .max(50, "Name must be at most 50 characters long")
});


const PasswordChangeSchema = z.object({
    currrentPassword :z.string()
            .min(6, "Password must be at least 6 characters long"),
    newPassword : z.string()
            .min(6, "Password must be at least 6 characters long")
})


// Type inference
type IUpdateUserSchema = zodInfer<typeof UpdateUserSchema>;
type IPasswordChangeSchema = zodInfer<typeof PasswordChangeSchema>;

// Response types
interface IGetUserResponse {
    user: IUser;
}

interface IUpdateUserResponse {
    user: IUser;
    message: string;
}

export type {
    IUpdateUserSchema,
    IPasswordChangeSchema,
    IGetUserResponse,
    IUpdateUserResponse
}

export {
    UpdateUserSchema,
    PasswordChangeSchema
}