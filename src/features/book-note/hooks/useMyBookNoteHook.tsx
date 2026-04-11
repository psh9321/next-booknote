"use client"
import { useInfiniteQuery } from "@tanstack/react-query";
import { API_GET_MY_BOOK_NOTE } from "@/entities/book-note/api/booknote";

export const useMyBookNoteHook = (userId : string, bookcode: string) => {
    const { data, isLoading, isFetching, isError, isSuccess, fetchNextPage, hasNextPage, refetch, isRefetching } = useInfiniteQuery({
        queryKey : [process.env.NEXT_PUBLIC_QUERY_KEY_MY_BOOK_NOTE, userId, bookcode],
        queryFn : async ({pageParam}) => {
            const result = await API_GET_MY_BOOK_NOTE(userId, bookcode, Number(pageParam??0));
            return result
        },
        enabled : typeof userId === "string" && userId.length > 0,
        initialPageParam : 0,
        getNextPageParam : (lastPage : CLIENT_API.BOOK_ITEM_LIST_RESPONSE) => {
            if(!lastPage) return undefined;
            const { page, total, limit } = lastPage;
            if(total <= 0) return undefined;
            const totalPage = Math.ceil(total/limit);
            if(page < totalPage - 1) return page+1;
            return undefined
        }
    });
    return { data, isLoading, isFetching, isError, isSuccess, fetchNextPage, hasNextPage, refetch, isRefetching }
}
