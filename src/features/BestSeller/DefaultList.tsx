"use client";

import Image from "next/image";
import Link from "next/link";

import { useBestSellerHook } from "@/hooks/useQuery";

export const BestSellerList = () => {

    const { data, isError } = useBestSellerHook();

    if(isError || !data) return <></>;

    return (
        <ul className="py-[20px] px-[20px] rounded-[10px] space-y-[20px] select-none">
           {
                (data as ALADIN.ALADIN_ITEM[]).map((el, i) => (
                    <li key={`${JSON.stringify(el)}-${i}`}>
                        <Link className="flex justify-between" href={`/book/${el["isbn"]}`}>
                            <div className="relative w-[120px] h-[170px] [@media(max-width:520px)]:w-[90px] [@media(max-width:520px)]:h-[140px]">
                                <Image fill sizes="auto" src={el["cover"]} alt={`${el["title"]} 커버 이미지`} loading="eager" className="object-cover rounded-[10px]"/>
                            </div>
                            <dl className="w-[calc(100%-150px)] mt-[12px] [&>dd]:leading-[1.8] [&>dd]:text-[0.8rem] [&>dd]:truncate [@media(max-width:520px)]:w-[calc(100%-110px)] [@media(max-width:520px)]:text-[0.9rem] [@media(max-width:520px)]:[&>dd]:text-[0.7rem]">
                                <dt className="mb-[15px] line-clamp-2">{el["title"]}</dt>
                                <dd>{el["author"]}</dd>
                                <dd>{el["publisher"]}</dd>
                            </dl>
                        </Link>
                    </li>
                ))
            }
        </ul>
    )
}