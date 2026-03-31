import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";

import SearchPageView from "./_view"
import { API_BEST_SELLER_LIST } from "@/features/BestSellerList/api/api.bestSeller";
import { API_GET_POPULAR_BOOK } from "@/features/PopularBookList/api/api.popular.book";

const SearchPageServer = async ({ params } : SEARCH_PAGE_PARAMS) => {

    const queryServer = new QueryClient();

    const { type } = await params

    switch (type) {
        case "book":
         await queryServer.prefetchQuery({
            queryKey: [process.env.NEXT_PUBLIC_QUERY_KEY_BEST_SELLER],
            queryFn: API_BEST_SELLER_LIST
        });       

        await queryServer.prefetchQuery({
            queryKey : [process.env.NEXT_PUBLIC_QUERY_KEY_BOOK_POPULAR],
            queryFn : API_GET_POPULAR_BOOK
        })
        break;
    }

    const dehydratedState = dehydrate(queryServer);

    return (
        <HydrationBoundary state={dehydratedState}>
            <SearchPageView type={type} />
        </HydrationBoundary>
    )
}

export default SearchPageServer