"use client"

import { PopularBookList } from "@/features/PopularBookList"

export const PopularBookBox = ({viewLength} : {viewLength? : number}) => {
    return (
        <article className="min-h-[400px] bg-[#2a2f32] rounded-[10px]">
            <h2 className="sr-only">인기도서 리스트</h2>
            <PopularBookList viewLength={viewLength}/>
        </article>
    )
}