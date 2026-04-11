"use client"

import Link from "next/link";
import Image from "next/image";

import { useEffect } from "react";

import { useSearchBookHook } from "../hooks/useSearchBookHook";
import { useInterSectionObserver } from "@/shared/hooks/useInterSectionObserver";

import { useSearchStore } from "../store/useSearchStore";
import { useLoadingStore } from "@/shared/store/useLoadingStore";

import { BookInfoLink } from "@/shared/ui/BookInfoLink";

export const SearchResult = () => {

    const searchKeyword = useSearchStore(state => state.keyword)

    const { data, isLoading, isFetching, hasNextPage, fetchNextPage } = useSearchBookHook(searchKeyword??"");

    const { ref, isView } = useInterSectionObserver<HTMLDivElement>({
        threshold : 0
    });

    const SetLoadingStatus = useLoadingStore(state => state.SetLoadingStatus);

    const isEmpty = (data?.pages as CLIENT_API.SEARCH_RESPONSE_DATA[])[0]?.total <= 0;

    
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
        <ul className="relative space-y-[20px]">
        {
            data &&
            isEmpty ?
            <dl className="mt-[110px] text-center font-bold">
                <dt className="mb-[20px] text-[1.4rem]">`{(data?.pages as CLIENT_API.SEARCH_RESPONSE_DATA[])[0].keyword}`</dt>
                <dd>검색된 도서가 없습니다.</dd>
            </dl>
            :

            data?.pages.map(page => {
                if(!page) return

                return page?.["list"]?.map((el, i) => 
                    <li key={`${JSON.stringify(page)}-${i}`}>
                        <BookInfoLink className="flex justify-between" href={`/book/${el["bookCode"]}`}>
                            <div className="relative w-[120px] h-[170px]">
                                <Image fill sizes="auto" src={el["bookCover"]} alt={`${el["bookTitle"]} 커버 이미지`} loading="eager" className="object-cover rounded-[10px]"/>
                            </div>
                            <dl className="w-[calc(100%-150px)] mt-[12px] [&>dd]:leading-[1.8] [&>dd]:text-[0.8rem] [&>dd]:truncate">
                                <dt className="mb-[15px] line-clamp-2">{el["bookTitle"]}</dt>
                                <dd>{el["bookAuther"]}</dd>
                                <dd>{el["bookPublisher"]}</dd>
                            </dl>
                        </BookInfoLink>
                    </li>
                )

            })
        }

            <div ref={ref} style={{height : "1px"}}></div>
        </ul>
    )
}
