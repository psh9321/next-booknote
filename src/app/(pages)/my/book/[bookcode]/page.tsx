import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";

import MyBookPageView from "./_view"
import { GetSessionId } from "@/server/util/getSessionId";
import { PrefetchBookInfo } from "@/server/prefetch/prefetch.book.info";
import { API_CHECK_REGISTER_BOOK } from "@/server/api/api.book";
import { PrefetchMyBookNote } from "@/server/prefetch/prefetch.my.book.note";

const MyBookPageServer = async ({ params } : BOOK_INFO_PAGE_PARAMS) => {
    
    const queryServer = new QueryClient();

    const { bookcode } = await params;

    const sessionId = await GetSessionId();

    await PrefetchBookInfo(queryServer, bookcode);

    let readingStatus = "" as READING_STATUS;

    if(sessionId) {
        await PrefetchMyBookNote(queryServer, sessionId, bookcode);

        readingStatus = await API_CHECK_REGISTER_BOOK(sessionId, bookcode);
    }

    const dehydratedState = dehydrate(queryServer);

    return (
         <HydrationBoundary state={dehydratedState}>
            <MyBookPageView bookcode={bookcode} status={readingStatus} />
         </HydrationBoundary>
        
    )
}

export default MyBookPageServer