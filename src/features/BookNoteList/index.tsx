"use client"

import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { useMyBookNoteHook } from "@/hooks/useQuery";

import { useInterSectionObserver } from "@/hooks/useInterSectionObserver";
import { BookNoteItem } from "./ui/BookNoteItem";

interface BOOK_NOTE_LIST {
    bookcode : string
}

export const BookNoteList = ({ bookcode } : BOOK_NOTE_LIST) => {

    const session = useSession();

    const { data, isFetching, fetchNextPage, hasNextPage, refetch } = useMyBookNoteHook(session.data?.user.id as string, bookcode);

    const { ref, isView } = useInterSectionObserver<HTMLLIElement>({
        threshold : 0
    })

    const isEmpty = (data?.pages as CLIENT_API.BOOK_ITEM_LIST_RESPONSE[])[0]?.total <= 0;

    useEffect(() => {
        if(!isView) return;
        if(isFetching) return;
        if(isEmpty) return;
        if(!hasNextPage) return;

        fetchNextPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isView]);

    

    return (
        <article>
            <h2 className="sr-only">해당 도서 독서노트 리스트</h2>
            {
                isEmpty ? 
                <p className="text-center">"등록된 독서노트가 없습니다."</p>  
                :
                <ol className="space-y-[50px]">
                    {
                        data?.pages.map(page => {
                            if(!page) return 

                            const list = (page as CLIENT_API.BOOK_NOTE_ITEM_RESPONSE)["list"];

                            return list.map((el, i) => {
                                return (
                                    <BookNoteItem key={`독서노트-${JSON.stringify(el)}-${i}`} RefetchCallback={refetch} item={el} />            
                                )
                            })
                        })
                    }
                    <li ref={ref} style={{height : "1px"}}></li>         
                </ol>
            }
        </article>

    )
}