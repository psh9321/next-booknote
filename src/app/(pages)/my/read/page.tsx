import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { GetSessionId } from "@/server/util/getSessionId"
import MyReadBookPageView from "./_view"
import { PrefetchMyBook } from "@/server/prefetch/prefetch.my.book";

const MyReadBookPageServer = async () => {

    const queryServer = new QueryClient();

    const sessionId = await GetSessionId();

    if(sessionId) {
        await PrefetchMyBook(queryServer, sessionId, "READ");
    }

    const dehydratedState = dehydrate(queryServer);

    return (
        <HydrationBoundary state={dehydratedState}>
            <MyReadBookPageView/>
        </HydrationBoundary>
    )
}

export default MyReadBookPageServer