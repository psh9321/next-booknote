import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";


import { PrefetchBestSeller } from "@/server/prefetch/prefetch.BestSeller";

import SearchPageView from "./_view"

const SearchPageServer = async () => {

    const queryServer = new QueryClient();
    
    await PrefetchBestSeller(queryServer);

    const dehydratedState = dehydrate(queryServer);

    return (
        <HydrationBoundary state={dehydratedState}>
            <SearchPageView/>
        </HydrationBoundary>
        
    )
}

export default SearchPageServer