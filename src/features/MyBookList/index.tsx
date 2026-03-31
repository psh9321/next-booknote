"use client"

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

import { useEffect } from "react";

import { useInterSectionObserver } from "@/hook/useInterSectionObserver";
import { useMyBookQueryHook } from "@/hook/useQuery"

export const MyBookList = () => {

    const session = useSession();

    const { data, isFetching, fetchNextPage, hasNextPage } = useMyBookQueryHook(session.data?.user.id);

    const { ref, isView } = useInterSectionObserver<HTMLLIElement>({
        threshold : 0
    })

    const isEmpty = (data?.pages as MY_BOOK_RESPONSE[])[0]?.total <= 0;

    useEffect(() => {
        if(!isView) return;
        if(isFetching) return;
        if(isEmpty) return;
        if(!hasNextPage) return;

        fetchNextPage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isView]);

    return (
        <ul className="flex flex-wrap gap-[20px]">
            {
                data?.pages.map(page => {

                    if(!page) return

                    const list = (page as MY_BOOK_RESPONSE)["list"];

                    return list.map((el, i) => {
                        return (
                            <li key={`내가등록한도서-${el["bookTitle"]}-${i}`}>
                                <Link href={`/book/${el["bookCode"]}`} className="relative block w-[160px] h-[245px] rounded-[10px] overflow-hidden">
                                    <Image fill sizes="auto" src={el["bookCover"]} alt={`${el["bookTitle"]} 커버 이미지`} loading="eager" className="object-cover"/>
                                </Link>
                                  
                            </li>
                        )
                    })
                })
            }


            <li ref={ref} style={{height : "1px"}}></li>
        </ul>
    )
}