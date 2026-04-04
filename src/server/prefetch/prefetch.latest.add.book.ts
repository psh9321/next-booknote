import type { QueryClient } from "@tanstack/react-query"

import { API_GET_LATEST_ADD_BOOK } from "@/server/api/api.book";

export async function PrefetchLatestAddBook(queryServer : QueryClient) {
    await queryServer.prefetchQuery({
        queryKey : [process.env.NEXT_PUBLIC_QUERY_KEY_LATEST_ADD_BOOK],
        queryFn : API_GET_LATEST_ADD_BOOK,
    })
}