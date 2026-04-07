"use client"

import Link from "next/link";
import Image from "next/image";

import { useSession } from "next-auth/react"

import { useEffect } from "react";

import { useInterSectionObserver } from "@/shared/hooks/useInterSectionObserver";
import { useMyBookHook } from "../hooks/useMyBookHook"
import { EmptyItem } from "@/shared/ui/EmptyItem";

import { emptyContents } from "../util/getEmptyContents";

interface MY_BOOK_LIST {
    status : READING_STATUS,
    className? : string
}

export const AfterLoginMyBookList = ({ status } : MY_BOOK_LIST) => {

    const session = useSession();

    const { data, isFetching, fetchNextPage, hasNextPage } = useMyBookHook(session.data?.user.id!, status);

    const { ref, isView } = useInterSectionObserver<HTMLLIElement>({
        threshold : 0
    })

    const isEmpty = data ? (data?.pages as CLIENT_API.BOOK_ITEM_LIST_RESPONSE[])[0]?.total <= 0 : true;

    useEffect(() => {
        /** 로그인 */
        if(session.status === "authenticated") {
            if(isEmpty) return;
            if(isFetching) return
            if(!hasNextPage) return;
            if(!isView) return;

            fetchNextPage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isView]);

    return (
        <>
            {
                /** 데이터 없음 */
                isEmpty ?
                    <EmptyItem className="mt-[150px] text-center" title={emptyContents[status]["title"]} txt={emptyContents[status]["txt"]}  anchorTxt={emptyContents[status]["anchorTxt"]}/> 
                :
                /** 데이터 있음 */
                <ol className={"inline-flex flex-wrap w-[calc(100%-10px)] select-none [@media(max-width:850px)]:gap-y-[15px] [@media(max-width:650px)]:w-full"}>
                    {
                        data?.pages.map(page => {

                            if(!page) return

                            const list = (page as CLIENT_API.BOOK_ITEM_LIST_RESPONSE)["list"];

                            return list.map((el, i) => {
                                return (
                                    <li className="m-[10px] [@media(max-width:1050px)]:w-[calc(20%-10px)] [@media(max-width:1050px)]:m-[5px] [@media(max-width:850px)]:w-[33%] [@media(max-width:850px)]:m-[0] [@media(max-width:600px)]:!w-[50%]" key={`내가등록한도서-${el["bookTitle"]}-${i}`}>
                                        <Link href={`/my/book/${el["bookCode"]}`} className="relative block rounded-[10px] [@media(max-width:850px)]:text-center">
                                            <Image width={170} height={250} sizes="auto" src={el["bookCover"] as string} alt={`${el["bookTitle"]} 커버 이미지`} loading="eager" className="inline-block object-contain rounded-[10px]"/>
                                        </Link>
                                    </li>
                                )
                            })
                        })
                    }

                    <li ref={ref} style={{height : "1px"}}></li>
                </ol>
            }        
        </>
    )
}
