import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { auth } from "@/auth";

import { API_GET_MY_SCRAP_BOOK_NOTE_LIST } from "@/entities/my/api/api.my.scrap.booknote";

import MyBookNoteScrapPageView from "./_view"

const MyBookNoteScrapServer = async () => {

    const queryServer = new QueryClient();

    const session = await auth();

    if(session) {
        const userId = session?.user.id;

        await queryServer.prefetchInfiniteQuery({
            queryKey: [process.env.NEXT_PUBLIC_QUERY_KEY_MY_BOOK_NOTE_LIST, userId],
            queryFn: async ({ pageParam }) => {
                return await API_GET_MY_SCRAP_BOOK_NOTE_LIST(userId, pageParam);
            },
            initialPageParam: 0,
            getNextPageParam(lastPage : MY_BOOK_NOTE_RESPONSE | null){
                if(!lastPage) return undefined;

                const { page, limit, total } = lastPage;

                const totalPage = Math.ceil(total/limit);

                if(page < totalPage) return page+1;

                return undefined
            }
        });
    }

    const dehydratedState = dehydrate(queryServer);

    return (
        <HydrationBoundary state={dehydratedState}>
            <MyBookNoteScrapPageView/>
        </HydrationBoundary>
    )
}

export default MyBookNoteScrapServer