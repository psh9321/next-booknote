"use client"

import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface BOOK_LIST {
    data : BOOK_ITEM[];
    className? : string,
}

export const BookList = ({data, className} : BOOK_LIST) => {
    return (
        <ol className={twMerge("min-h-[400px] mt-[20px] py-[20px] px-[20px] bg-[#2A2F32] rounded-[10px] space-y-[20px]", className)}>
            {
                data.map((el, i) => {
                    return <li key={`인기도서-${el["bookTitle"]}-${i}`}>
                        <Link className="flex justify-between" href={`/book/${el["bookCode"]}`}>
                            <div className="relative w-[120px] h-[170px]">
                                <Image fill sizes="auto" src={el["bookCover"]} alt={`${el["bookTitle"]} 커버 이미지`} loading="eager" className="object-cover rounded-[10px]"/>
                            </div>
                            <dl className="
                                w-[calc(100%-150px)]
                                mt-[12px]
                                [&>dd]:leading-[1.8]
                                [&>dd]:text-[0.8rem]
                                [&>dd]:truncate
                            ">
                                <dt className="mb-[15px] line-clamp-2">{el["bookTitle"]}</dt>
                                <dd>{el["bookAuther"]}</dd>
                                <dd>{el["bookPublisher"]}</dd>
                            </dl>
                        </Link>
                    </li>
                })
            }
            
        </ol>
    )
}