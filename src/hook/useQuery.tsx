"use client"

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import { API_BEST_SELLER_LIST } from "@/features/BestSellerList/api/api.bestSeller";
import { API_GET_POPULAR_BOOK } from "@/features/PopularBookList/api/api.popular.book";
import { API_GET_POPULAR_BOOK_NOTE } from "@/features/PopularBookNoteList/api/api.popular.book.note";
import { API_GET_SEARCH_BOOK } from "@/features/SearchBox/api/api.search.book";
import { API_GET_MY_BOOK_LIST } from "@/entities/my/api/api.my.book";
import { API_GET_MY_BOOK_NOTE_LIST } from "@/entities/my/api/api.my.booknote";

export const useBestSellerListHook = () => {
    
    const { data, isLoading, isFetching, isError, isSuccess } = useQuery({
        queryKey : [process.env.NEXT_PUBLIC_QUERY_KEY_BEST_SELLER],
        queryFn : API_BEST_SELLER_LIST
    })

    return { data, isLoading, isFetching, isError, isSuccess };

};

export const usePopularBookNoteFeedHook = () => {

    const { data, isLoading, isFetching, isError, isSuccess } = useQuery({
        queryKey : [process.env.NEXT_PUBLIC_QUERY_KEY_BOOK_NOTE_POPULAR],
        queryFn : API_GET_POPULAR_BOOK_NOTE
    })

    return { data, isLoading, isFetching, isError, isSuccess };
};

export const usePopularBookHook = () => {
    const { data, isLoading, isFetching, isError, isSuccess } = useQuery({
        queryKey : [process.env.NEXT_PUBLIC_QUERY_KEY_BOOK_POPULAR],
        queryFn : API_GET_POPULAR_BOOK
    })

    return { data, isLoading, isFetching, isError, isSuccess };
};

export const useSearchResultQueryHook = (searchType : SEARCH_PARAMS_TYPE, keyword : string | null,) => {

    const { data, isLoading, isFetching, isError, isSuccess, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey : ["search", searchType, keyword],
        queryFn : async ({pageParam}) => {
            const result = await API_GET_SEARCH_BOOK(keyword!, Number(pageParam??1), 10);

            return result??undefined
        },
        enabled : typeof keyword === "string" && keyword.trim().length > 0,
        initialPageParam : 1,
        getNextPageParam : (lastPage) => {
            if(!lastPage) return undefined;

            const { page, total, limit } = lastPage;

            if(total <= 0) return undefined;

            const totalPage = Math.ceil(total/limit);

            if(page < totalPage) return page+1;

            return undefined
        }
    });

    return { data, isLoading, isFetching, isError, isSuccess, fetchNextPage, hasNextPage };
}

export const useMyBookQueryHook = (userId : string | undefined) => {

    const { data, isLoading, isFetching, isError, isSuccess, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey : [process.env.NEXT_PUBLIC_QUERY_KEY_MY_BOOK_LIST, userId],
        queryFn : async ({pageParam}) => {
            const result = await API_GET_MY_BOOK_LIST(userId as string, pageParam);

            return result
        },
        enabled : userId !== undefined,
        initialPageParam : 0,
        getNextPageParam(lastPage){
            if(!lastPage) return undefined;

            const { page, limit, total } = lastPage as MY_BOOK_RESPONSE;

            const totalPage = Math.ceil(total/limit);

            if(page < totalPage) return page+1;

            return undefined
        }
    })

    return { data, isLoading, isFetching, isError, isSuccess, fetchNextPage, hasNextPage };
}

export const useMyBookNoteQueryHook = (userId : string | undefined) => {

    const { data, isLoading, isFetching, isError, isSuccess, fetchNextPage, hasNextPage } = useInfiniteQuery({
        queryKey : [process.env.NEXT_PUBLIC_QUERY_KEY_MY_BOOK_NOTE_LIST, userId],
        queryFn : async ({pageParam}) => {
            const result = await API_GET_MY_BOOK_NOTE_LIST(userId as string, pageParam);

            return result
        },
        enabled : userId !== undefined,
        initialPageParam : 0,
        getNextPageParam(lastPage){
            if(!lastPage) return undefined;

            const { page, limit, total } = lastPage as MY_BOOK_NOTE_RESPONSE;

            const totalPage = Math.ceil(total/limit);

            if(page < totalPage) return page+1;

            return undefined
        }
    })

    return { data, isLoading, isFetching, isError, isSuccess, fetchNextPage, hasNextPage };
}