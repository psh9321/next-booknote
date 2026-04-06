import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { PrefetchBestSeller } from "@/entities/book/api/prefetch.bestseller";
import { PrefetchLatestBook } from "@/entities/book/api/prefetch.latest.book";
import { PrefetchLatestBookNote } from "@/entities/book-note/api/prefetch.latest.booknote";
import IndexPageView from "./_view"
import { GetSessionId } from "@/shared/lib/getSessionId";

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