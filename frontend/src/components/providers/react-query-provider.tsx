'use client';

import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import React from 'react'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false, // Disable retries globally to prevent duplicate API calls
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
        mutations: {
            retry: false, // Disable mutation retries
        },
    },
})

export default function ReactQueryProvider({
    children
} : {
    children : React.ReactNode
}) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
