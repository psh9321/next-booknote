import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { API_TARGET_BOOK_INFO } from "../entities/book/api/api.book.info";
import { BookInfoView } from "../features/BookInfoView";

export const BookInfoPrefetch = async ({params} : BOOK_INFO_PAGE_PARAMS) => {

    const queryServer = new QueryClient();

    const { bookcode } = await params;

    const data = await queryServer.fetchQuery({
        queryKey: [process.env.NEXT_PUBLIC_QUERY_KEY_BOOK_INFO, bookcode],
        queryFn: () => API_TARGET_BOOK_INFO(bookcode)
    });

    const dehydratedState = dehydrate(queryServer);

    return (
        <HydrationBoundary state={dehydratedState}>
            <BookInfoView data={data as ALADIN.BOOK_ITEM}/>        
        </HydrationBoundary>
    )
}

