import type { QueryClient } from "@tanstack/react-query"
import { API_GET_MY_BOOK } from "../api/api.book";

export async function PrefetchMyBook(queryServer : QueryClient, userId : string, status : READING_STATUS) {
        await queryServer.prefetchInfiniteQuery({
            queryKey: [process.env.NEXT_PUBLIC_QUERY_KEY_MY_READ_BOOK, userId, status],
            queryFn: async ({ pageParam }) => {
                return await API_GET_MY_BOOK(userId, pageParam, status);
            },
            initialPageParam: 0,
            getNextPageParam(lastPage : CLIENT_API.BOOK_ITEM_LIST_RESPONSE){
                if(!lastPage) return undefined;

                const { page, limit, total } = lastPage;

                const totalPage = Math.ceil(total/limit);

                if(page < totalPage - 1) return page + 1;

                return undefined
            }
        });

}