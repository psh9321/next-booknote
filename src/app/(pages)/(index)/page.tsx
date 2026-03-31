import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { API_BEST_SELLER_LIST } from "@/features/BestSellerList/api/api.bestSeller";

import IndexPageView from "./_view";
import { API_GET_POPULAR_BOOK_NOTE } from "@/features/PopularBookNoteList/api/api.popular.book.note";
import { API_GET_POPULAR_BOOK } from "@/features/PopularBookList/api/api.popular.book";

const IndexPageServer = async () => {
    const queryServer = new QueryClient();

    await queryServer.prefetchQuery({
        queryKey: [process.env.NEXT_PUBLIC_QUERY_KEY_BEST_SELLER],
        queryFn: API_BEST_SELLER_LIST
    });

    await queryServer.prefetchQuery({
        queryKey : [process.env.NEXT_PUBLIC_QUERY_KEY_BOOK_NOTE_POPULAR],
        queryFn : API_GET_POPULAR_BOOK_NOTE
    })

    await queryServer.prefetchQuery({
        queryKey : [process.env.NEXT_PUBLIC_QUERY_KEY_BOOK_POPULAR],
        queryFn : API_GET_POPULAR_BOOK
    })

    const dehydratedState = dehydrate(queryServer);

    return (
        <HydrationBoundary state={dehydratedState}>
            <IndexPageView />
        </HydrationBoundary>
    )
};

export default IndexPageServer;
