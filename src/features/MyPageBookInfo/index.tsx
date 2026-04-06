"use client"

import Image from "next/image"

import { useRouter } from "next/navigation";

import { ChevronLeft } from 'lucide-react';

import { useBookInfoHook } from "@/hooks/useQuery";

import { BtnRegister } from "../BtnRegister";
import { BtnDescription } from "./ui/BtnDescription";

interface MY_PAGE_BOOK_INFO {
    bookcode : string,
    status : READING_STATUS
}

export const MyPageBookInfo = ({ bookcode, status } : MY_PAGE_BOOK_INFO) => {
    const { data } = useBookInfoHook(bookcode);

    const navigation = useRouter();

    function NaviCallback() {
        window.history.length > 1 ? navigation.back() : navigation.push("/my/read");
    }

    if(!data) return <></>

    return (
        <article className="relative">
            <h2 className="sr-only">{data?.["title"]} 정보</h2>
            <button title="뒤로가기" onClick={NaviCallback} className="absolute top-0 left-0"><ChevronLeft size={45}/></button>
            <div className="inline-block mb-[20px]">
                <div className="flex items-end mb-[15px]">
                    <Image loading="eager" width={150} height={220} sizes="auto" src={data?.["cover"]??""} alt={`${data?.["title"]} 커버 이미지`} />
                    <BtnDescription className="ml-[5px]" description={data?.["description"]}/>
                </div>
                <BtnRegister item={data} status={status} />
            </div>

            <dl className="mb-[30px] font-bold space-y-[6px] break-keep [&>dd]:text-[0.8rem]">
                <dt className="mb-[20px]">{data?.["title"]}</dt>
                <dd>총 {data?.["subInfo"]?.["itemPage"]} 페이지</dd>
                <dd>{data?.["publisher"]}</dd>
                <dd>{data?.["author"]}</dd>
                <dd className="inline-flex flex-wrap gap-[10px] mt-[20px]">
                    {
                        data?.["categoryName"].split(">").map((category, i) => <span className="py-[5px] px-[8px] text-[0.7rem] bg-[#888] rounded-[10px]" key={`${data?.["title"]}-${category}-${i}`}>{category}</span>)
                    }
                </dd>
            </dl>
        </article>
    )
}