import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { GetSessionId } from "@/shared/lib/getSessionId";
import { PrefetchBookInfo } from "@/entities/book/api/prefetch.book.info";
import { API_CHECK_REGISTER_BOOK } from "@/entities/book/api/book";
import { PrefetchMyBookNote } from "@/entities/book-note/api/prefetch.my.book.note";

import MyBookPageView from "./_view"

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