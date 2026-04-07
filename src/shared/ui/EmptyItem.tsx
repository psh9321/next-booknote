"use client"

import Link from "next/link";

import { BookAlert } from "lucide-react";

interface EMPTY_ITEM {
    className? : string,
    title : string,
    txt : string,
    anchorTxt? : string,
    isAnchor? : boolean
}
export const EmptyItem = ({ className, title, txt, anchorTxt, isAnchor = true } : EMPTY_ITEM) => {
    return (
        <dl className={`leading-[2] text-center font-bold ${className??""}`}>
            <dt className="flex flex-col justify-center items-center">
                <BookAlert size={50} className="inline-block mb-[20px]"/>{title}
            </dt>
            <dd className="text-[0.8rem]">{txt}</dd>
            <dd>
                {
                    isAnchor && 
                    <Link className="inline-block mt-[30px] border-b" href={"/search"}>
                        "{anchorTxt}"
                    </Link>
                }
                
            </dd>
        </dl>
    )
}