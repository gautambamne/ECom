'use client';
import { UserAction } from "@/api-actions/user-action";
import { useAuthStore } from "../../store/auth-store"
import React, { useEffect } from 'react'
import { useQuery } from "@tanstack/react-query";
import { e164 } from "zod";

export default function AuthProvider({ children } : { children : React.ReactNode }) {
    const { setLogin, setLogout } = useAuthStore()

    const {data, isLoading, isError, error} = useQuery({
        queryKey: ["current-user"],
        queryFn: UserAction.GetCurrentUser,
        refetchOnWindowFocus: false,
        retry: false //prevent retrying on auth errors 
    })

    useEffect(()=>{
        async function fetchCurrentUser() {
            try {
                const data = await UserAction.GetCurrentUser()
                setLogin(data)
            } catch (error) {
                setLogout()
            }
            if(!isLoading && data) {
                setLogin(data)
            }
        }

        fetchCurrentUser()
    }, [data, isLoading, setLogin, setLogout])
    
    useEffect(()=>{
        if(error && isError) {
            setLogout()
        }
    }, [error, isError, setLogout])

    return <>{children}</>
}