import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { API_GET_TARGET_BOOK_INFO } from "@/server/api/api.aladin";

export const BookInfoServer = async ({params} : BOOK_INFO_PAGE_PARAMS) => {

    const queryServer = new QueryClient();

    const { bookcode } = await params;

    const data = await queryServer.fetchQuery({
        queryKey: [process.env.NEXT_PUBLIC_QUERY_KEY_BOOK_INFO, bookcode],
        queryFn: () => API_GET_TARGET_BOOK_INFO(bookcode)
    });

    return (
        <></>
    )
}