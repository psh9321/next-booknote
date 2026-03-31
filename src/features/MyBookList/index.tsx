"use client"

import { useInterSectionObserver } from "@/hook/useInterSectionObserver";
import { useMyBookQueryHook } from "@/hook/useQuery"
import Image from "next/image";
import { useEffect } from "react";

interface MY_BOOK_LIST {
    userId : string
}

export const MyBookList = ({ userId } : MY_BOOK_LIST) => {

    const { data, isFetching, fetchNextPage, hasNextPage } = useMyBookQueryHook(userId);

    const { ref, isView } = useInterSectionObserver<HTMLLIElement>({
        threshold : 0
    })

    const isEmpty = (data?.pages as MY_BOOK_RESPONSE[])[0]?.total <= 0;

    useEffect(() => {
        if(!hasNextPage) return
        if(isFetching) return;
        if(isEmpty) return;

        fetchNextPage();
    },[isEmpty, isView, isFetching, fetchNextPage]);

    return (
        <ul className="flex flex-wrap gap-[10px] w-full">
            {
                data?.pages.map(page => {

                    if(!page) return

                    const list = (page as MY_BOOK_RESPONSE)["list"];

                    return list.map((el, i) => {
                        return (
                            <li key={`내가등록한도서-${el["bookTitle"]}-${i}`}>
                                <div className="relative w-[160px] h-[245px] rounded-[10px] overflow-hidden">
                                    <Image fill sizes="auto" src={el["bookCover"]} alt={`${el["bookTitle"]} 커버 이미지`} loading="eager" className="object-cover"/>
                                </div>
                                  
                            </li>
                        )
                    })
                })
            }


            <li ref={ref} style={{height : "1px"}}></li>
        </ul>
    )
}