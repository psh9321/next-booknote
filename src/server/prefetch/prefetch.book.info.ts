import type { QueryClient } from "@tanstack/react-query"

import { API_GET_TARGET_BOOK_INFO } from "../api/api.aladin";

export async function PrefetchBookInfo(queryServer : QueryClient, bookcode : string) {
    await queryServer.prefetchQuery({
        queryKey : [process.env.NEXT_PUBLIC_QUERY_KEY_BOOK_INFO, bookcode],
        queryFn : () => API_GET_TARGET_BOOK_INFO(bookcode),
    })
}