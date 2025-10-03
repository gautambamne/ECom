'use client'
import {useForm} from 'react-hook-form'
import { AuthActions } from '@/api-actions/auth-actions'
import {useMutation} from '@tanstack/react-query'
import { IForgotPasswordSchema, ForgotPasswordSchema, ICheckVerificationCodeSchema, CheckVerificationCodeSchema, IResetPasswordSchema, ResetPasswordSchema } from '@/schema/auth-schema';
import {zodResolver} from '@hookform/resolvers/zod'
import { useAuthStore } from '@/store/auth-store';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type FormStage = 'email' | 'verify' | 'reset';

export default function ForgotPasswordForm() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [stage, setStage] = useState<FormStage>('email');
    const [email, setEmail] = useState(user?.email || '');

    // Email form
    const emailForm = useForm<IForgotPasswordSchema>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
          email: user?.email || ""
        }
    });

    // Verification form
    const verifyForm = useForm<ICheckVerificationCodeSchema>({
        resolver: zodResolver(CheckVerificationCodeSchema),
        defaultValues: {
          email: email,
          verification_code: ""
        }
    });

    // Reset password form
    const resetForm = useForm<IResetPasswordSchema>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
          email: email,
          verification_code: "",
          new_password: ""
        }
    });

    const [hydrated, setHydrated] = useState(false);

    // Mutations
    const forgotPasswordMutation = useMutation({
        mutationFn: AuthActions.ForgotPasswordAction,
        onSuccess: (data) => {
            toast.success(data.message);
            const currentEmail = emailForm.getValues('email');
            setEmail(currentEmail);
            setStage('verify');
            verifyForm.setValue('email', currentEmail);
        },
        onError: (error: ApiError) => {
            const errormessage = error.message;
            toast.error(errormessage);
        }
    });

    const verifyCodeMutation = useMutation({
        mutationFn: AuthActions.CheckVerificationCodeAction,
        onSuccess: (data) => {
            toast.success(data.message);
            const currentEmail = verifyForm.getValues('email');
            const currentCode = verifyForm.getValues('verification_code');
            setStage('reset');
            resetForm.setValue('email', currentEmail);
            resetForm.setValue('verification_code', currentCode);
        },
        onError: (error: ApiError) => {
            const errormessage = error.errors?.detail || error.message;
            toast.error(errormessage);
        }
    });

    const resetPasswordMutation = useMutation({
        mutationFn: AuthActions.ResetPasswordAction,
        onSuccess: (data) => {
            toast.success(data.message);
            // Redirect to login after successful password reset
            router.push('/login');
        },
        onError: (error: ApiError) => {
            const errormessage = error.errors.detail || error.message;
            toast.error(errormessage);
        }
    });

    useEffect(() => {
        setHydrated(true);
        // Update the form with user email if available
        if (user?.email) {
            emailForm.setValue('email', user.email);
            setEmail(user.email);
        }
    }, [user?.email, emailForm]);

    // Update forms when email state changes
    useEffect(() => {
        if (email) {
            verifyForm.setValue('email', email);
            resetForm.setValue('email', email);
        }
    }, [email, verifyForm, resetForm]);

    if(!hydrated) return null;

    const handleEmailSubmit = (data: IForgotPasswordSchema) => {
        setEmail(data.email);
        forgotPasswordMutation.mutate(data);
    };

    const handleVerifySubmit = (data: ICheckVerificationCodeSchema) => {
        verifyCodeMutation.mutate(data);
    };

    const handleResetSubmit = (data: IResetPasswordSchema) => {
        resetPasswordMutation.mutate(data);
    };

    const goBackToEmail = () => {
        setStage('email');
    };

    const goBackToVerify = () => {
        setStage('verify');
    };

    return (
        <div className="space-y-6">
            {stage === 'email' && (
                <Form {...emailForm}>
                    <form
                        onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={emailForm.control}
                            name='email'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block text-sm">
                                        Email Address
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            required
                                            autoComplete='off'
                                            placeholder="Enter your email address"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type='submit' disabled={forgotPasswordMutation.isPending} className='w-full'>
                            {forgotPasswordMutation.isPending ? "Sending Reset Link..." : "Send Reset Code"}
                        </Button>
                    </form>
                </Form>
            )}

            {stage === 'verify' && (
                <Form {...verifyForm}>
                    <form
                        onSubmit={verifyForm.handleSubmit(handleVerifySubmit)}
                        className="space-y-6"
                    >
                        <div className="text-center mb-4">
                            <p className="text-sm text-muted-foreground">
                                We've sent a verification code to <strong>{email}</strong>
                            </p>
                        </div>

                        {/* Hidden email field */}
                        <input type="hidden" {...verifyForm.register('email')} />

                        <FormField
                            control={verifyForm.control}
                            name='verification_code'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block text-sm">
                                        Verification Code
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            required
                                            autoComplete='off'
                                            placeholder="Enter 6-digit code"
                                            maxLength={6}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3">
                            <Button
                                type='button'
                                variant="outline"
                                onClick={goBackToEmail}
                                className='flex-1'
                            >
                                Back
                            </Button>
                            <Button type='submit' disabled={verifyCodeMutation.isPending} className='flex-1'>
                                {verifyCodeMutation.isPending ? "Verifying..." : "Verify Code"}
                            </Button>
                        </div>
                    </form>
                </Form>
            )}

            {stage === 'reset' && (
                <Form {...resetForm}>
                    <form
                        onSubmit={resetForm.handleSubmit(handleResetSubmit)}
                        className="space-y-6"
                    >
                        <div className="text-center mb-4">
                            <p className="text-sm text-muted-foreground">
                                Enter your new password
                            </p>
                        </div>

                        {/* Hidden fields for email and verification_code */}
                        <input type="hidden" {...resetForm.register('email')} />
                        <input type="hidden" {...resetForm.register('verification_code')} />

                        <FormField
                            control={resetForm.control}
                            name='new_password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="block text-sm">
                                        New Password
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            required
                                            autoComplete='off'
                                            placeholder="Enter new password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3">
                            <Button
                                type='button'
                                variant="outline"
                                onClick={goBackToVerify}
                                className='flex-1'
                            >
                                Back
                            </Button>
                            <Button type='submit' disabled={resetPasswordMutation.isPending} className='flex-1'>
                                {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
}