'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function VendorIndexPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard when accessing /vendor
    router.replace('/vendor/dashboard')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}