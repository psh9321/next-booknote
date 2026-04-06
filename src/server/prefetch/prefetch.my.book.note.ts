import type { QueryClient } from "@tanstack/react-query"
import { API_GET_MY_BOOK_NOTE } from "../api/api.booknote";

export async function PrefetchMyBookNote(queryServer : QueryClient, userId : string, bookcode : string) {
    await queryServer.prefetchInfiniteQuery({
        queryKey: [process.env.NEXT_PUBLIC_QUERY_KEY_MY_BOOK_NOTE, userId, bookcode],
        queryFn: async ({ pageParam }) => {
            return await API_GET_MY_BOOK_NOTE(userId, bookcode, pageParam);
        },
        initialPageParam: 0,
        getNextPageParam(lastPage : CLIENT_API.BOOK_NOTE_ITEM_RESPONSE){
            if(!lastPage) return undefined;

            const { page, limit, total } = lastPage;

            const totalPage = Math.ceil(total/limit);

            if(page < totalPage - 1) return page + 1;

            return undefined
        }
    });

}