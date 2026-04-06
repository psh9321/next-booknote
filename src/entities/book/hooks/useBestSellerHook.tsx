"use client"
import { useQuery } from "@tanstack/react-query";
import { API_GET_BEST_SELLER } from "@/entities/book/api/aladin";

export const useBestSellerHook = () => {
    const { data, isLoading, isFetching, isError, isSuccess } = useQuery({
        queryKey : [process.env.NEXT_PUBLIC_QUERY_KEY_BEST_SELLER],
        queryFn : API_GET_BEST_SELLER,
        enabled : false
    })
    return { data, isLoading, isFetching, isError, isSuccess };
};
