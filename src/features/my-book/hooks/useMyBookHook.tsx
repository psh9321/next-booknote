"use client"
import { useInfiniteQuery } from "@tanstack/react-query";
import { API_GET_MY_BOOK } from "@/entities/book/api/book";

export const useMyBookHook = (userId : string, status : READING_STATUS) => {
    const { data, isLoading, isFetching, isError, isSuccess, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey : [process.env.NEXT_PUBLIC_QUERY_KEY_MY_BOOK, userId, status],
        queryFn : async ({pageParam}) => {
            const result = await API_GET_MY_BOOK(userId, Number(pageParam??0), status);
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
    return { data, isLoading, isFetching, isError, isSuccess, fetchNextPage, hasNextPage }
}
