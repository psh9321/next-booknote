"use client"

import Image from "next/image"

import { useParams, useRouter } from "next/navigation";

import { useLayoutEffect } from "react";

import { X } from 'lucide-react';

import { useBookInfoHook } from "@/hooks/useQuery";

import { BtnRegister } from "./ui/BtnRegister";

interface BOOK_INFO_VIEW {
    status : READING_STATUS
}

export const BookInfoView = ({ status } : BOOK_INFO_VIEW) => {

    const { bookcode } = useParams();

    const { data } = useBookInfoHook(bookcode as string);

    const navigation = useRouter();

    function NaviCallback() {
        window.history.length > 1 ? navigation.back() : navigation.push("/");
    }

    useLayoutEffect(() => {
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        }
    },[])

    if(!data) return <></>
    
    
    return (
        <article className="relative bg-[#2A2F32] rounded-[10px]">
            <h2 className="sr-only">{data?.["title"]} 도서 정보</h2>
            <button onClick={NaviCallback} className="absolute top-[-40px] left-[0]" title="뒤로가기"><X size={35}/></button>
            <div className="flex flex-wrap justify-between w-[450px] h-[530px] mx-auto py-[40px] px-[40px] overflow-y-auto">
                <div className="relative w-[150px] h-[220px]">
                    <Image className="mb-[15px]" loading="eager" width={150} height={220} sizes="auto" src={data?.["cover"]??""} alt={`${data?.["title"]} 커버 이미지`} />
                    <BtnRegister item={data} status={status} />
                </div>
                <dl className="w-[calc(100%-180px)] font-bold space-y-[6px] break-keep [&>dd]:text-[0.8rem]">
                    <dt className="mb-[30px] text-[1.2rem]">{data?.["title"]}</dt>
                    <dd>{data?.["publisher"]}</dd>
                    <dd>{data?.["author"]}</dd>
                    <dd className="flex flex-wrap gap-[10px] mt-[20px]">
                        {
                            data?.["categoryName"].split(">").map((category, i) => <span className="py-[5px] px-[8px] text-[0.7rem] bg-[#888] rounded-[10px]" key={`${data?.["title"]}-${category}-${i}`}>{category}</span>)
                        }
                    </dd>
                    <dd className="mt-[30px]">총 {data?.["subInfo"]?.["itemPage"]} 페이지</dd>
                </dl>
                <dl className="w-full leading-[1.8] mt-[50px] break-keep">
                    <dt className="inline-block mb-[10px] border-b">책 소개</dt>
                    <dd>{data?.["description"]}</dd>
                </dl>
            </div>
        </article>
    )
}