"use client"

import Link from "next/link";
import Image from "next/image";

import TextareaAutosize from "react-textarea-autosize";

import { useLatestBookNoteHook } from "@/hooks/useQuery"

import { GetTimeAgo } from "@/shared/util/getTimeAgo";

import { EmptyItem } from "@/shared/ui/EmptyItem"

export const LatestBookNoteList = () => {

    const { data } = useLatestBookNoteHook();

    return (
        <ol>
            {
                data?.length > 0 ?
                data?.map((el, i) => {
                    return (
                    <li key={`최근등록된 북노트-${el["bookTitle"]}-${i}`} className="relative w-[450px] p-[20px] font-bold border rounded-[10px]">
                        <dl className='flex items-end mb-[20px] pb-[10px] text-[1.1rem] border-b'>
                            <dt className="relative w-[40px] h-[40px] bg-[#f0f] rounded-[100%]">
                                <Link href={`/book/${el["bookCode"]}`} className="relative block w-full h-full">
                                    <Image src={el["bookCover"]} alt={`${el["bookTitle"]} 커버 이미지`} fill sizes="auto" className="object-cover rounded-[10px]" />
                                </Link>
                            </dt>
                            <dd className="ml-[10px] text-[0.8rem]">{GetTimeAgo(el["createDate"])} 등록</dd>
                        </dl>
                        <TextareaAutosize value={el["noteContents"]} />
                    </li>
                    )
                })
                :
                <li>
                    <EmptyItem title="노트를 등록한 유저가 없습니다." txt="로그인 후 노트를 등록해보세요." anchorTxt="노트 등록할 책 찾기"/>
                </li>
            }
        </ol>
    )
}