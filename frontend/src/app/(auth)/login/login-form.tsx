'use client'
import {useForm} from 'react-hook-form'
import { AuthActions } from '@/api-actions/auth-actions'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import { ILoginSchema, LoginSchema } from '@/schema/auth-schema';
import {zodResolver} from '@hookform/resolvers/zod'
import { useAuthStore } from '@/store/auth-store';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const {setLogin, setLogout} = useAuthStore();
    const queryClient = useQueryClient();
    const router = useRouter();
    const form = useForm<ILoginSchema>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
          email: "",
          password: ""
    }
  })

  const [hydrated, setHydrated] = useState(false)

   const {mutate, isPending} = useMutation({
    mutationFn: AuthActions.LoginAction,
    onSuccess: async (data) => {
      setLogin(data.user, data.access_token)
      toast(data.message)

      // Invalidate and refetch current user data
      await queryClient.invalidateQueries({ queryKey: ["current-user"] })

      // Check user role and redirect accordingly using Next.js router
      const userRoles = data.user.role || []
      if (userRoles.includes('VENDOR')) {
        router.push('/vendor/dashboard')
      } else {
        router.push('/')
      }
    },
    onError: (error: ApiError) => {
      setLogout()
      const errormessage = error.message
      toast.error(errormessage)
    }
  })

  useEffect(() => {
    setHydrated(true)
  }, [])

if(!hydrated) return null;

function onSubmit (data: ILoginSchema) {
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
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm">
                  Password
                </FormLabel>
                <Button asChild variant="link" size="sm">
                  <Link
                    href="/login?mode=forgot"
                    className="link intent-info variant-ghost text-sm"
                  >
                    Forgot your Password ?
                  </Link>
                </Button>
              </div>
              <FormControl>
                <Input
                  type="password"
                  required
                  autoComplete="off"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' disabled={isPending} className='w-full'>
          {isPending ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}

