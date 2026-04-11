"use client"

import Link from "next/link";
import Image from "next/image";

interface SEARCH_ITEM {
    item : CLIENT_API.SEARCH_ITEM,

}

export const SearchItem = ({item} : SEARCH_ITEM) => {
    return (
        <li>
            <Link href={`/book/${item["bookCode"]}`} className="flex justify-between">
                <div className="relative w-[120px] h-[170px]">
                    <Image fill sizes="auto" src={item["bookCover"]} alt={`${item["bookTitle"]} 커버 이미지`} loading="eager" className="object-cover rounded-[10px]"/>
                </div>
                <dl className="w-[calc(100%-150px)] mt-[12px] [&>dd]:leading-[1.8] [&>dd]:text-[0.8rem] [&>dd]:truncate">
                    <dt className="mb-[15px] line-clamp-2">{item["bookTitle"]}</dt>
                    <dd>{item["bookAuther"]}</dd>
                    <dd>{item["bookPublisher"]}</dd>
                </dl>
            </Link>
        </li>
    )
}