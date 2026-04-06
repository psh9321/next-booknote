"use client"
import { useQuery } from "@tanstack/react-query";
import { API_GET_TARGET_BOOK_INFO } from "@/entities/book/api/aladin";

export const useBookInfoHook = (bookcode : String) => {
    const { data, isLoading, isFetching, isError, isSuccess } = useQuery({
        queryKey : [process.env.NEXT_PUBLIC_QUERY_KEY_BOOK_INFO, bookcode],
        queryFn : async () => {
            const result = await API_GET_TARGET_BOOK_INFO(bookcode as string);
            return result??null
        },
        enabled : false
    })
    return { data, isLoading, isFetching, isError, isSuccess };
}
