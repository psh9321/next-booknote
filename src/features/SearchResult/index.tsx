import { useSearchResultQueryHook } from "@/hook/useQuery";
import { useSearchStore } from "../SearchBox/store/useSearchStore";
import { useEffect } from "react";
import { BookList } from "@/shared/ui/BookList";
import { useInterSectionObserver } from "@/hook/useInterSectionObserver";


interface SEARCH_RESULT {
    type : SEARCH_PARAMS_TYPE
}

export const SearchResult = ({ type } : SEARCH_RESULT) => {

    const searchKeyword = useSearchStore(state => state.keyword)

    const { isLoading, data, isFetching, fetchNextPage, hasNextPage } = useSearchResultQueryHook(type, searchKeyword);

    const { ref, isView } = useInterSectionObserver<HTMLDivElement>({
        threshold : 0
    })

    const isEmpty = (data?.pages as SEARCH_BOOK_DATA[])[0]?.total <= 0;

    useEffect(() => {
        if(!isView) return;
        if(isLoading) return;
        if(isFetching) return;
        if(isEmpty) return;
        if(!hasNextPage) return;

        fetchNextPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isView]);

    return (
        <article className="relative py-[40px] space-y-[20px]">
        { 
            data &&
            isEmpty ? 
            <dl className="mt-[110px] text-center font-bold">
                <dt className="mb-[20px] text-[1.4rem]">`{(data?.pages as SEARCH_BOOK_DATA[])[0].keyword}`</dt>
                <dd>검색된 도서가 없습니다.</dd>
            </dl>
            :
            data?.pages.map(page => {

                if(!page) return

                const item = (page as SEARCH_BOOK_DATA)["list"];

                return <BookList className="mt-[0px] py-[0]" key={JSON.stringify(page)} data={item} />
            })

                
        }        

            <div ref={ref} style={{height : "1px"}}></div>
        </article>

    )
}