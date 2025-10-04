'use client'
import {useForm} from 'react-hook-form'
import { AuthActions } from '@/api-actions/auth-actions'
import {useMutation} from '@tanstack/react-query'
import { IVerifySchema, VerifySchema } from '@/schema/auth-schema';
import {zodResolver} from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

export default function VerificationForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const form = useForm<IVerifySchema>({
        resolver: zodResolver(VerifySchema),
        defaultValues: {
          email: email,
          verification_code: ""
        }
    });

    const [hydrated, setHydrated] = useState(false);

    const {mutate, isPending} = useMutation({
        mutationFn: AuthActions.VerifyAction,
        onSuccess: (data) => {
            toast.success(data.message)
            // Redirect to login after successful verification
            router.push('/login');
        },
        onError: (error: ApiError) => {
            const errormessage = error.errors?.detail || error.message
            toast.error(errormessage)
        }
    });

    useEffect(() => {
        setHydrated(true);
        // Update form with email from URL
        if (email) {
            form.setValue('email', email);
        }
    }, [email, form]);

    if(!hydrated) return null;

    function onSubmit(data: IVerifySchema) {
        mutate(data)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground">
                        We've sent a verification code to <strong>{email}</strong>
                    </p>
                </div>

                {/* Hidden email field */}
                <input type="hidden" {...form.register('email')} />

                <FormField
                    control={form.control}
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

                <Button type='submit' disabled={isPending} className='w-full'>
                    {isPending ? "Verifying..." : "Verify Email"}
                </Button>
            </form>
        </Form>
    );
}
