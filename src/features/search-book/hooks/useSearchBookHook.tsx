"use client"
import { useInfiniteQuery } from "@tanstack/react-query";
import { API_CLIENT_GET_SEARCH_BOOK } from "@/features/search-book/api/api.search.book";

export const useSearchBookHook = (keyword : string) => {
    const { data, isLoading, isFetching, isError, isSuccess, fetchNextPage, hasNextPage, isRefetching } = useInfiniteQuery({
        queryKey : ["search", keyword],
        queryFn : async ({pageParam}) => {
            const result = await API_CLIENT_GET_SEARCH_BOOK(keyword!, Number(pageParam??1), 10);
            return result
        },
        enabled : typeof keyword === "string" && keyword.trim().length > 0,
        initialPageParam : 1,
        getNextPageParam : (lastPage : CLIENT_API.SEARCH_RESPONSE_DATA) => {
            if(!lastPage) return undefined;
            const { page, total, limit } = lastPage;
            if(total <= 0) return undefined;
            const totalPage = Math.ceil(total/limit);
            if(page < totalPage) return page+1;
            return undefined
        }
    });
    return { data, isLoading, isFetching, isError, isSuccess, fetchNextPage, hasNextPage }
}
