"use client"

import Link from "next/link";
import Image from "next/image";

import TextareaAutosize from "react-textarea-autosize";

import { SquareArrowOutUpRight } from 'lucide-react';

import { useLatestBookNoteHook } from "@/entities/book-note/hooks/useLatestBookNoteHook"

import { EmptyItem } from "@/shared/ui/EmptyItem"
import { DateFormat } from "@/shared/util/dateFormat";
import { useSession } from "next-auth/react";
import { BookInfoLink } from "@/shared/ui/BookInfoLink";

export const LatestBookNoteList = () => {

    const session = useSession();

    const { data } = useLatestBookNoteHook(session.data?.user.id??undefined);

    return (
        <ol className="space-y-[20px]">
            {
                (data?.length ?? 0) > 0 ?
                data?.map((el, i) => {
                    return (
                    <li key={`최근등록된 북노트-${el["bookTitle"]}-${i}`} className="relative w-full p-[20px] font-bold border rounded-[10px]">
                        <dl className='flex items-end mb-[20px] pb-[10px] text-[1.1rem] border-b select-none'>
                            <dt className="relative w-[40px] h-[40px] bg-[#f0f] rounded-[100%]">
                                <BookInfoLink href={`/book/${el["bookCode"]}`} className="relative block w-full h-full">
                                    <Image src={el["bookCover"]??""} alt={`${el["bookTitle"]} 커버 이미지`} fill sizes="auto" className="object-cover rounded-[10px]" />
                                </BookInfoLink>
                            </dt>
                            <dd className="ml-[10px] text-[0.8rem]">{DateFormat(el?.["createAt"].toString())} 등록</dd>
                            <dd className="absolute top-[20px] right-[20px]">
                                <Link href={`/my/book/${el?.["bookCode"]}`}><SquareArrowOutUpRight size={20}/></Link>
                            </dd>
                        </dl>
                        <TextareaAutosize value={el["noteContents"]??""} />
                    </li>
                    )
                })
                :
                <li>
                    {
                        session.status === "authenticated" ? <EmptyItem title="등록한 노트가 없습니다." txt="노트를 등록해보세요." anchorTxt="노트 등록할 책 찾기"/>
                        : <EmptyItem title="독서노트는 로그인후 등록 가능합니다." txt="로그인 후 노트를 등록해보세요." isAnchor={false}/>
                    }
                </li>
            }
        </ol>
    )
}
