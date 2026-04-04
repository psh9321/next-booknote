"use client"

import { 
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


/** 4시간 */
const CATCH_TIME = ((1000 * 60) * 60) * 4;

const queryClient = new QueryClient({
    defaultOptions : {
        queries : {
            
            staleTime : CATCH_TIME,
            gcTime : CATCH_TIME,
            refetchOnMount: false,       // ✅ 마운트 시 재요청 막기
            refetchOnWindowFocus: false, // ✅ 포커스 시 재요청 막기
            retry : false,
        }
    }
});

const QueryProvider = ({children} : LAYOUT_CHILD) => {
    return (    
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={process.env.NODE_ENV === "development"}/>
        </QueryClientProvider>
    )
}

export default QueryProvider