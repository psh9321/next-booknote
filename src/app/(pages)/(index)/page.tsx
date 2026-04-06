import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { PrefetchBestSeller } from "@/server/prefetch/prefetch.bestSeller";
import { PrefetchLatestBook } from "@/server/prefetch/prefetch.latest.book";
import { PrefetchLatestBookNote } from "@/server/prefetch/prefetch.latest.booknote";
import IndexPageView from "./_view"
import { GetSessionId } from "@/server/util/getSessionId";

const IndexPageServer = async () => {

    const queryServer = new QueryClient();

    await PrefetchBestSeller(queryServer);
    await PrefetchLatestBook(queryServer);

    const sessionId = await GetSessionId();
    
    if(sessionId) {
        
        await PrefetchLatestBookNote(queryServer, sessionId);
    }

    const dehydratedState = dehydrate(queryServer);

    return (
        <HydrationBoundary state={dehydratedState}>
            <IndexPageView />
        </HydrationBoundary>
    )
}

export default IndexPageServer