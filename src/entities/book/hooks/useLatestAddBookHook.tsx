"use client"
import { useQuery } from "@tanstack/react-query";
import { API_GET_LATEST_ADD_BOOK } from "@/entities/book/api/book";

export const useLatestAddBookHook = () => {
    const { data, isLoading, isFetching, isError, isSuccess } = useQuery({
        queryKey : [process.env.NEXT_PUBLIC_QUERY_KEY_LATEST_ADD_BOOK],
        queryFn : API_GET_LATEST_ADD_BOOK,
    })
    return { data, isLoading, isFetching, isError, isSuccess };
}
