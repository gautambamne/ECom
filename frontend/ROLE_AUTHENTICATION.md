# Role-Based Authentication System

## Overview
This system implements role-based access control (RBAC) for the vendor dashboard. Only users with the `VENDOR` role can access vendor-specific routes.

## Key Components

### 1. `useRoleAuth` Hook
**Location:** `src/hooks/use-role-auth.ts`

Provides role checking utilities:
```tsx
const { 
  isLoggedIn, 
  isVendor, 
  isAdmin, 
  isCustomer, 
  roles, 
  hasRole, 
  hasAnyRole, 
  hasAllRoles 
} = useRoleAuth()
```

### 2. `withAuth` HOC (Higher-Order Component)
**Location:** `src/components/providers/with-auth.tsx`

Wraps components to provide role-based protection:
```tsx
export default withAuth(YourComponent, {
  allowedRoles: ['VENDOR'],
  redirectTo: '/', // Optional
  showAccessDenied: true // Optional
})
```

### 3. Enhanced AuthProvider
**Location:** `src/components/providers/auth-provider.tsx`

Manages authentication state and user data fetching.

### 4. Login Redirect Logic
**Location:** `src/app/(auth)/login/login-form.tsx`

Automatically redirects users based on their roles after login:
- `VENDOR` → `/vendor/dashboard`
- Others → `/`

## Implementation

### Vendor Route Protection
The vendor layout is protected using the `withAuth` HOC:

```tsx
// src/app/(vendor)/vendor/layout.tsx
export default withAuth(VendorLayout, {
  allowedRoles: ['VENDOR'],
  redirectTo: '/',
  showAccessDenied: true
})
```

### User Role Structure
```typescript
interface IUser {
  id: string;
  name: string;
  email: string;
  role: string[]; // Array of roles: ['VENDOR', 'ADMIN', 'CUSTOMER']
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}
```

## Authentication Flow

1. **User attempts to access `/vendor/*`**
2. **`withAuth` HOC checks authentication:**
   - Is user logged in?
   - Does user have required role (`VENDOR`)?
3. **Outcomes:**
   - ✅ **Authorized:** Show vendor dashboard
   - ❌ **Not logged in:** Redirect to `/login`
   - ❌ **Wrong role:** Show access denied page

## Security Features

- **Client-side role verification**
- **Hydration-safe rendering** (prevents flash of unauthorized content)
- **Professional access denied UI**
- **Automatic login redirects** based on user roles
- **Loading states** during authentication checks
- **Error handling** with toast notifications

## Testing

### Using the Debug Component
Temporarily add to any page to verify roles:
```tsx
import RoleDebugComponent from '@/components/debug/role-debug'

// In your component
<RoleDebugComponent />
```

### Test Scenarios
1. **No authentication:** Should redirect to login
2. **Wrong role:** Should show access denied
3. **Correct role (VENDOR):** Should access dashboard
4. **Login as vendor:** Should auto-redirect to dashboard

## Error Handling

- **Not logged in:** Toast message + redirect to `/login`
- **Insufficient permissions:** Access denied page with role information
- **Loading states:** Professional loading spinners
- **Network errors:** Graceful fallbacks

## Best Practices

1. **Use layout-level protection** for route groups
2. **Use page-level protection** for specific requirements  
3. **Use hooks for conditional rendering** within components
4. **Always handle loading and error states**
5. **Remove debug components** in production

## Production Checklist

- [ ] Remove `RoleDebugComponent` from dashboard
- [ ] Test all authentication flows
- [ ] Verify role assignments on backend
- [ ] Test error scenarios
- [ ] Verify loading states work properly

## Routes Protected

- `/vendor/*` - All vendor routes require `VENDOR` role
- Layout-level protection ensures all child routes are automatically protected
- Individual pages can have additional role requirements if needed