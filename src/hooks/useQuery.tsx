"use client"

import { API_CLIENT_GET_SEARCH_BOOK } from "@/features/SearchBox/api/api.search.book";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import { API_GET_BEST_SELLER, API_GET_TARGET_BOOK_INFO } from "@/server/api/api.aladin";
import { API_GET_LATEST_ADD_BOOK, API_GET_MY_BOOK } from "@/server/api/api.book";
import { API_GET_MY_BOOK_NOTE, API_LATEST_BOOK_NOTE } from "@/server/api/api.booknote";

/** 베스트 셀러 */
export const useBestSellerHook = () => {
    
    const { data, isLoading, isFetching, isError, isSuccess } = useQuery({
        queryKey : [process.env.NEXT_PUBLIC_QUERY_KEY_BEST_SELLER],
        queryFn : API_GET_BEST_SELLER,
        enabled : false
    })

    return { data, isLoading, isFetching, isError, isSuccess };

};

/** 도서 상세 페이지 */
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

/** 최근 유저들이 등록한 도서 */
export const useLatestAddBookHook = () => {
    const { data, isLoading, isFetching, isError, isSuccess } = useQuery({
        queryKey : [process.env.NEXT_PUBLIC_QUERY_KEY_LATEST_ADD_BOOK],
        queryFn : API_GET_LATEST_ADD_BOOK,
    })

    return { data, isLoading, isFetching, isError, isSuccess };
}

/** 검색결과 훅 */
export const useSearchBookHook = (keyword : string) => {
    const { data, isLoading, isFetching, isError, isSuccess, fetchNextPage, hasNextPage } = useInfiniteQuery({
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

export const useMyBookNoteHook = (userId : string, bookcode: string) => {

    const { data, isLoading, isFetching, isError, isSuccess, fetchNextPage, hasNextPage, refetch } = useInfiniteQuery({
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

    return { data, isLoading, isFetching, isError, isSuccess, fetchNextPage, hasNextPage, refetch }
}