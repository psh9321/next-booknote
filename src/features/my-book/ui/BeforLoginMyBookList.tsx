"use client"

import Link from "next/link";
import Image from "next/image";

import { useEffect, useState } from "react";

import { useIndexedDBHook } from "@/shared/hooks/useIndexedDB";

import { EmptyItem } from "@/shared/ui/EmptyItem";

import { emptyContents } from "../util/getEmptyContents";

interface MY_BOOK_LIST {
    status : READING_STATUS,
}

export const BeforeLoginMyBookList = ({ status } : MY_BOOK_LIST) => {
    
    /** 비 로그인 시 사용할 데이터 */
    const [bookList, SetBookList] = useState<Partial<BOOK_MODEL>[]>([]);

    const { GetBookList } = useIndexedDBHook();

    useEffect(() => {
        GetBookList(status)
        .then(SetBookList)
    },[]);

    return (
        <>
        {
            bookList.length <= 0 ?
            <EmptyItem className="mt-[150px] text-center" title={emptyContents[status]["title"]} txt={emptyContents[status]["txt"]}  anchorTxt={emptyContents[status]["anchorTxt"]}/> 
            :
            <ol className={"inline-flex flex-wrap w-[calc(100%-10px)] select-none [@media(max-width:850px)]:gap-y-[15px] [@media(max-width:650px)]:w-full"}>
                {
                    bookList.map((el, i) => {
                        return (
                            <li className="m-[10px] [@media(max-width:1050px)]:w-[calc(20%-10px)] [@media(max-width:1050px)]:m-[5px] [@media(max-width:850px)]:w-[33%] [@media(max-width:850px)]:m-[0] [@media(max-width:600px)]:!w-[50%]" key={`내가등록한도서-${el["bookTitle"]}-${i}`}>
                                <Link href={`/my/book/${el["bookCode"]}`} className="relative block rounded-[10px] [@media(max-width:850px)]:text-center">
                                    <Image width={170} height={250} sizes="auto" src={el["bookCover"] as string} alt={`${el["bookTitle"]} 커버 이미지`} loading="eager" className="inline-block object-contain rounded-[10px]"/>
                                </Link>
                            </li>
                        )
                    })
                }
            </ol>
        }
        </>
    )
}