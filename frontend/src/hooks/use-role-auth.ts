'use client'

import { useAuthStore } from '@/store/auth-store'
import { useMemo } from 'react'

export function useRoleAuth() {
  const { user, isLoggedIn } = useAuthStore()

  const roleChecks = useMemo(() => {
    if (!isLoggedIn || !user) {
      return {
        isLoggedIn: false,
        isVendor: false,
        isAdmin: false,
        isCustomer: false,
        roles: [],
        hasRole: () => false,
        hasAnyRole: () => false,
        hasAllRoles: () => false
      }
    }

    const userRoles = user.role || []

    return {
      isLoggedIn: true,
      isVendor: userRoles.includes('VENDOR'),
      isAdmin: userRoles.includes('ADMIN'),
      isCustomer: userRoles.includes('CUSTOMER'),
      roles: userRoles,
      hasRole: (role: string) => userRoles.includes(role),
      hasAnyRole: (roles: string[]) => roles.some(role => userRoles.includes(role)),
      hasAllRoles: (roles: string[]) => roles.every(role => userRoles.includes(role))
    }
  }, [user, isLoggedIn])

  return roleChecks
}

export default useRoleAuth