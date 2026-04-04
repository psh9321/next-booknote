import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { PrefetchBestSeller } from "@/server/prefetch/prefetch.BestSeller";
import { PrefetchLatestAddBook } from "@/server/prefetch/prefetch.latest.add.book";

import IndexPageView from "./_view"

const IndexPageServer = async () => {

    const queryServer = new QueryClient();

    await PrefetchBestSeller(queryServer);
    await PrefetchLatestAddBook(queryServer);

    const dehydratedState = dehydrate(queryServer);

    return (
        <HydrationBoundary state={dehydratedState}>
            <IndexPageView />
        </HydrationBoundary>
    )
}

export default IndexPageServer