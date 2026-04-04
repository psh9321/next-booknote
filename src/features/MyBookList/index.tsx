"use client"

import Link from "next/link";
import Image from "next/image";

import { useSession } from "next-auth/react"

import { useEffect } from "react";

import { useInterSectionObserver } from "@/hooks/useInterSectionObserver";
import { useMyBookHook } from "@/hooks/useQuery"
import { EmptyItem } from "@/shared/ui/EmptyItem";



const emptyContents : {
    [key in READING_STATUS] : {
        title : string,
        txt : string,
        anchorTxt : string
    }
} = {
    "READ": {
        title : "현재 읽고 있는 도서가 없습니다.",
        txt : "읽어볼 도서를 찾아보세요.",
        anchorTxt : "읽을 책 찾기"
    },
    "WISH" : {
        title : "현재 읽고 싶은 도서가 없습니다.",
        txt : "읽고싶은 도서를 찾아보세요.",
        anchorTxt : "읽을 책 찾기"
    },
    "COMPLETED" : {
        title : "현재 완독한 도서가 없습니다.",
        txt : "읽어볼 도서를 찾아보세요.",
        anchorTxt : "읽을 책 찾기"
    },
}

interface MY_BOOK_LIST {
    status : READING_STATUS,
    className? : string
}

export const MyBookList = ({ status, className } : MY_BOOK_LIST) => {

    const session = useSession();

    const { data, isFetching, fetchNextPage, hasNextPage } = useMyBookHook(session.data?.user.id!, status);


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
        <>
            <ol className={"flex flex-wrap gap-[25px]"}>
                {
                    isEmpty ? 
                    <EmptyItem className="mt-[150px] text-center" title={emptyContents[status]["title"]} txt={emptyContents[status]["txt"]}  anchorTxt={emptyContents[status]["anchorTxt"]}/>
                    :
                    data?.pages.map(page => {

                        if(!page) return

                        const list = (page as CLIENT_API.BOOK_ITEM_LIST_RESPONSE)["list"];

                        return list.map((el, i) => {
                            return (
                                <li className="text-center" key={`내가등록한도서-${el["bookTitle"]}-${i}`}>
                                    <Link href={`/my/booknote/${el["_id"]}/${el["bookCode"]}`} className="relative block rounded-[10px]">
                                        <Image width={170} height={250} sizes="auto" src={el["bookCover"] as string} alt={`${el["bookTitle"]} 커버 이미지`} loading="eager" className="object-contain rounded-[10px]"/>
                                    </Link>
                                </li>
                            )
                        })
                    })
                }

                <li ref={ref} style={{height : "1px"}}></li>
            </ol>        
        </>

    )
}