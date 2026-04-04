
import type { QueryClient } from "@tanstack/react-query"

import { API_GET_BEST_SELLER } from "@/server/api/api.aladin";

export async function PrefetchBestSeller(queryServer : QueryClient) {
    await queryServer.prefetchQuery({
        queryKey: [process.env.NEXT_PUBLIC_QUERY_KEY_BEST_SELLER],
        queryFn: API_GET_BEST_SELLER
    });
}