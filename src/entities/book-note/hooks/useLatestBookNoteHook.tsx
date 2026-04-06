"use client"
import { useQuery } from "@tanstack/react-query";
import { API_LATEST_BOOK_NOTE } from "@/entities/book-note/api/booknote";

export const useLatestBookNoteHook = (userId : string | undefined) => {
    const { data, isLoading, isFetching, isError, isSuccess } = useQuery({
        queryKey : [process.env.NEXT_PUBLIC_QUERY_KEY_LATEST_BOOK_NOTE, userId],
        queryFn : async () => {
            if(!userId) return null
            return await API_LATEST_BOOK_NOTE(userId)
        },
        enabled : typeof userId === "string",
    });
    return { data, isLoading, isFetching, isError, isSuccess }
}
