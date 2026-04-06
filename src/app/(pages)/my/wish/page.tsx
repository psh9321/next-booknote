import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { GetSessionId } from "@/shared/lib/getSessionId"
import { PrefetchMyBook } from "@/entities/book/api/prefetch.my.book";

import MyWishBookPageView from "./_view"

const MyWishBookPageServer = async () => {

    const queryServer = new QueryClient();

    const sessionId = await GetSessionId();

    if(sessionId) {
        await PrefetchMyBook(queryServer, sessionId, "WISH");
    }

    const dehydratedState = dehydrate(queryServer);

    return (
        <HydrationBoundary state={dehydratedState}>
            <MyWishBookPageView/>
        </HydrationBoundary>
    )
}

export default MyWishBookPageServer