import type { QueryClient } from "@tanstack/react-query"

import { API_LATEST_BOOK_NOTE } from "../api/api.booknote";

export async function PrefetchLatestBookNote(queryServer : QueryClient, userId : string) {
    await queryServer.prefetchQuery({
        queryKey : [process.env.NEXT_PUBLIC_QUERY_KEY_LATEST_BOOK_NOTE, userId],
        queryFn : () => API_LATEST_BOOK_NOTE(userId),
    })
}