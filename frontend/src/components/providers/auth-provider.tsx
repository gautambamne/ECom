'use client';
import { UserActions } from "@/api-actions/user-action";
import { useAuthStore } from "../../store/auth-store"
import React, { useEffect } from 'react'
import { useQuery } from "@tanstack/react-query";
import { e164 } from "zod";

export default function AuthProvider({ children } : { children : React.ReactNode }) {
    const { setLogin, setLogout, isLoggedIn } = useAuthStore()

    const {data, isLoading, isError, error} = useQuery({
        queryKey: ["current-user"],
        queryFn: UserActions.GetCurrentUserAction,
        refetchOnWindowFocus: false,
        retry: false, //prevent retrying on auth errors
        enabled: isLoggedIn // Only fetch if user is logged in
    })

    useEffect(() => {
        if (!isLoading && data && data.user) {
            setLogin(data.user)
        }
    }, [data, isLoading, setLogin])
    
    useEffect(() => {
        if (error && isError) {
            console.error('Auth error:', error)
            setLogout()
        }
    }, [error, isError, setLogout])

    return <>{children}</>
}