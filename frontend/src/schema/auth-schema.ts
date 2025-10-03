import { z, infer as zodInfer } from 'zod';

const RegistrationSchema = z.object({
    name: z.string()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name must be at most 50 characters long"),
    email: z.email("Invalid email address"),
    password: z.string()
        .min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string()
        .min(6, "Confirm password must be at least 6 characters long"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const LoginSchema = z.object({
    email: z.email("Invalid email address"),
    password: z.string()
        .min(6, "Password must be at least 6 characters long"),
});

const VerifySchema = z.object({
    email: z.email("Invalid email address"),
    verification_code: z.string()
        .min(6, "Verification code must be at least 6 characters long")
        .max(6, "Verification code must be exactly 6 characters long"),
});

const CheckVerificationCodeSchema = z.object({
    email: z.email("Invalid email address"),
    verification_code: z.string()
        .min(6, "Verification code must be at least 6 characters long")
        .max(6, "Verification code must be exactly 6 characters long"),
});

const ForgotPasswordSchema = z.object({
     email: z.email("Invalid email address"),
});

const ResendVerificationCodeSchema = z.object({
     email: z.email("Invalid email address"),
});

const ResetPasswordSchema = z.object({
     email: z.email("Invalid email address"),

     verification_code: z.string()
        .min(6, "Verification code must be at least 6 characters long")
        .max(6, "Verification code must be exactly 6 characters long"),

    new_password: z.string()
        .min(6, "New Password must be at least 6 characters long")
});

type IRegistrationSchema = zodInfer<typeof RegistrationSchema>;
type ILoginSchema = zodInfer<typeof LoginSchema>;
type IVerifySchema = zodInfer<typeof VerifySchema>;
type ICheckVerificationCodeSchema = zodInfer<typeof CheckVerificationCodeSchema>;
type IForgotPasswordSchema = zodInfer<typeof ForgotPasswordSchema>;
type IResendVerificationCodeSchema = zodInfer<typeof ResendVerificationCodeSchema>;
type IResetPasswordSchema = zodInfer<typeof ResetPasswordSchema>;

export type {
    IRegistrationSchema,
    ILoginSchema,
    IVerifySchema,
    ICheckVerificationCodeSchema,
    IForgotPasswordSchema,
    IResendVerificationCodeSchema,
    IResetPasswordSchema
}

export {
    RegistrationSchema,
    LoginSchema,
    VerifySchema,
    CheckVerificationCodeSchema,
    ForgotPasswordSchema,
    ResendVerificationCodeSchema,
    ResetPasswordSchema
};