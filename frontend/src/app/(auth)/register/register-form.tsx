'use client'
import {useForm} from 'react-hook-form'
import { AuthActions } from '@/api-actions/auth-actions'
import {useMutation} from '@tanstack/react-query'
import { IRegistrationSchema, RegistrationSchema } from '@/schema/auth-schema';
import {zodResolver} from '@hookform/resolvers/zod'
import { useAuthStore } from '@/store/auth-store';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RegisterForm() {
    const {setLogout} = useAuthStore();
    const form = useForm<IRegistrationSchema>({
        resolver: zodResolver(RegistrationSchema),
        defaultValues: {
          name: "",
          email: "",
          password: "",
          confirmPassword: ""
        }
    })

    const [hydrated, setHydrated] = useState(false)

    const {mutate, isPending} = useMutation({
        mutationFn: AuthActions.RegisterAction,
        onSuccess: (data) => {
            toast.success(data.message)
            // Optionally redirect to verification page or login
            // You might want to redirect to a verification page here
        },
        onError: (error: ApiError) => {
            setLogout()
            const errormessage = error.errors.detail || error.message
            toast.error(errormessage)
        }
    })

    useEffect(() => {
        setHydrated(true)
    }, [])

    if(!hydrated) return null;

    function onSubmit(data: IRegistrationSchema) {
        mutate(data)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block text-sm">
                                Full Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    required
                                    autoComplete='off'
                                    placeholder="Enter your full name"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="block text-sm">
                                Email
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="email"
                                    required
                                    autoComplete='off'
                                    placeholder="Enter your email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className="text-sm">
                                Password
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    required
                                    autoComplete="off"
                                    placeholder="Create a password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className="text-sm">
                                Confirm Password
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    required
                                    autoComplete="off"
                                    placeholder="Confirm your password"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type='submit' disabled={isPending} className='w-full'>
                    {isPending ? "Creating Account..." : "Create Account"}
                </Button>
            </form>
        </Form>
    );
}
