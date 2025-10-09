'use client'

import { useAuthStore } from '@/store/auth-store'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useRoleAuth } from '@/hooks/use-role-auth'
import { Button } from '@/components/ui/button'
import { Home, LogIn, Shield } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { UserActions } from '@/api-actions/user-action'

interface WithAuthOptions {
  allowedRoles: string[]
  redirectTo?: string
  showAccessDenied?: boolean
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions
) {
  return function AuthProtectedComponent(props: P) {
    const { isLoggedIn: storeLoggedIn } = useAuthStore()
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [mounted, setMounted] = useState(false)

    // Fetch current user data using React Query
    const { data: userData, isLoading: userLoading, error: userError } = useQuery({
      queryKey: ["current-user"],
      queryFn: UserActions.GetCurrentUserAction,
      enabled: storeLoggedIn && mounted,
      retry: false,
      refetchOnWindowFocus: false
    })

    // Handle client-side mounting to prevent hydration issues
    useEffect(() => {
      setMounted(true)
    }, [])

    useEffect(() => {
      if (!mounted) return

      const checkAuth = async () => {
        // If not logged in according to store, redirect to login
        if (!storeLoggedIn) {
          toast.error('Please login to access the vendor dashboard')
          router.push('/login')
          setIsLoading(false)
          return
        }

        // Wait for user data to load
        if (userLoading) {
          return // Still loading, don't check yet
        }

        // If there's an error fetching user data, logout
        if (userError) {
          console.error('Error fetching user data:', userError)
          toast.error('Authentication failed. Please login again.')
          router.push('/login')
          setIsLoading(false)
          return
        }

        // Check if user data is available
        if (!userData || !userData.user) {
          console.log('No user data available')
          toast.error('Please login to access the vendor dashboard')
          router.push('/login')
          setIsLoading(false)
          return
        }

        // Check if user has required role
        const userRoles = userData.user.role || []
        const hasRequiredRole = options.allowedRoles.some(role => userRoles.includes(role))

        if (!hasRequiredRole) {
          toast.error(`Access denied. This area is restricted to ${options.allowedRoles.join(' or ')} users only.`)
          console.log('User roles:', userRoles, 'Required roles:', options.allowedRoles)
          
          if (options.showAccessDenied !== false) {
            setIsAuthorized(false)
            setIsLoading(false)
            return
          }
          router.push(options.redirectTo || '/')
          setIsLoading(false)
          return
        }

        // User is authorized
        setIsAuthorized(true)
        setIsLoading(false)
      }

      checkAuth()
    }, [storeLoggedIn, userData, userLoading, userError, mounted, router, options.allowedRoles, options.redirectTo, options.showAccessDenied])

    // Prevent hydration mismatch
    if (!mounted) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    }

    // Show loading state
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Verifying access permissions...</p>
          </div>
        </div>
      )
    }

    // Show access denied page
    if (!isAuthorized) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="text-center space-y-6 max-w-md mx-auto p-8">
            <div className="w-20 h-20 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
              <Shield className="w-10 h-10 text-destructive" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Access Restricted</h1>
              <p className="text-muted-foreground text-lg">
                This area is reserved for <span className="font-semibold text-primary">{options.allowedRoles.join(' or ')}</span> users only.
              </p>
            </div>

            {storeLoggedIn && userData?.user ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Your current roles: <span className="font-medium">{userData.user.role?.length > 0 ? userData.user.role.join(', ') : 'None'}</span>
                </p>
                <div className="flex gap-3 justify-center">
                  <Button onClick={() => router.push('/')} variant="outline">
                    <Home className="w-4 h-4 mr-2" />
                    Go Home
                  </Button>
                  <Button onClick={() => router.back()}>
                    Go Back
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Please login with a vendor account to access this area.
                </p>
                <Button onClick={() => router.push('/login')} className="w-full">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login to Continue
                </Button>
              </div>
            )}
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}

export default withAuth