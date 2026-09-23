'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * Client provider untuk TanStack Query.
 * QueryClient dibuat di dalam useState agar tidak dibagikan antar request
 * saat render di server (pola resmi React/Next.js).
 */
export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        retry: 1,
                    },
                },
            })
    );

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
