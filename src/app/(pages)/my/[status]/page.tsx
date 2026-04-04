import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { GetSessionId } from "@/server/util/getSessionId"
import MyBookPageView from "./_view"
import { PrefetchMyBook } from "@/server/prefetch/prefetch.my.read.book";

const MyReadBookPageServer = async ({ params } : MY_PAGE_PARAMS) => {

    const { status } = await params;
    
    const queryServer = new QueryClient();

    const sessionId = await GetSessionId();

    const readingStatus = status?.toUpperCase() as READING_STATUS;

    if(sessionId) {
        await PrefetchMyBook(queryServer, sessionId, readingStatus);
    }

    const dehydratedState = dehydrate(queryServer);

    return (
        <HydrationBoundary state={dehydratedState}>
            <MyBookPageView status={readingStatus}/>
        </HydrationBoundary>
    )
}

export default MyReadBookPageServer