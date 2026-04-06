import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { GetSessionId } from "@/shared/lib/getSessionId"
import MyCompletedBookPageView from "./_view"
import { PrefetchMyBook } from "@/entities/book/api/prefetch.my.book";

const MyCompletedBookPageServer = async () => {

    const queryServer = new QueryClient();

    const sessionId = await GetSessionId();

    if(sessionId) {
        await PrefetchMyBook(queryServer, sessionId, "COMPLETED");
    }

    const dehydratedState = dehydrate(queryServer);

    return (
        <HydrationBoundary state={dehydratedState}>
            <MyCompletedBookPageView/>
        </HydrationBoundary>
    )
}

export default MyCompletedBookPageServer