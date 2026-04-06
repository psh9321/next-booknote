import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { PrefetchBookInfo } from "@/entities/book/api/prefetch.book.info";

import { BookInfoView } from "@/features/book-info/ui/BookInfoView"
import { API_CHECK_REGISTER_BOOK } from "@/entities/book/api/book";
import { GetSessionId } from "@/shared/lib/getSessionId";

export const BookInfoServerWidget = async ({ params } : BOOK_INFO_PAGE_PARAMS) => {

    const queryServer = new QueryClient();

    const { bookcode } = await params;

    const sessionId = await GetSessionId();

    await PrefetchBookInfo(queryServer, bookcode);

    let readingStatus = "" as READING_STATUS;

    if(sessionId) {
        readingStatus = await API_CHECK_REGISTER_BOOK(sessionId, bookcode);
    }

    const dehydratedState = dehydrate(queryServer);

    return (
        <HydrationBoundary state={dehydratedState}>
            <section className="fixed top-0 left-0 flex flex-col justify-center items-center w-dvw h-dvh z-[9999] bg-[rgba(0,0,0,0.7)]">
                <h1 className="sr-only">도서 정보 페이지</h1>
                <BookInfoView status={readingStatus}/>
            </section>
        </HydrationBoundary>

    )
}
