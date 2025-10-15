'use client';
import { useAuthStore } from "../../store/auth-store"
import React, { useEffect } from 'react'

export default function AuthProvider({ children } : { children : React.ReactNode }) {
    const { initializeAuth } = useAuthStore()

    useEffect(() => {
        // Initialize auth state on app start
        initializeAuth()
    }, [initializeAuth])

    return <>{children}</>
}