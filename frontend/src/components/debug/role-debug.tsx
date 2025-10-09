'use client'

import { useRoleAuth } from '@/hooks/use-role-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, User, CheckCircle, XCircle } from 'lucide-react'

export function RoleDebugComponent() {
  const { 
    isLoggedIn, 
    isVendor, 
    isAdmin, 
    isCustomer, 
    roles, 
    hasRole, 
    hasAnyRole 
  } = useRoleAuth()

  if (!isLoggedIn) {
    return (
      <Card className="w-full max-w-md mx-auto mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Authentication Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-destructive">
            <XCircle className="w-4 h-4" />
            <span>Not logged in</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Role Authentication Debug
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span>Authenticated</span>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">Current Roles:</h4>
          <div className="flex gap-2 flex-wrap">
            {roles.length > 0 ? (
              roles.map(role => (
                <Badge key={role} variant="secondary">
                  {role}
                </Badge>
              ))
            ) : (
              <Badge variant="outline">No roles assigned</Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isVendor ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>Vendor: {isVendor ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>Admin: {isAdmin ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isCustomer ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>Customer: {isCustomer ? 'Yes' : 'No'}</span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Has VENDOR role:</span>
            <span className={hasRole('VENDOR') ? 'text-green-600' : 'text-red-600'}>
              {hasRole('VENDOR') ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Has any role (VENDOR, ADMIN):</span>
            <span className={hasAnyRole(['VENDOR', 'ADMIN']) ? 'text-green-600' : 'text-red-600'}>
              {hasAnyRole(['VENDOR', 'ADMIN']) ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RoleDebugComponent