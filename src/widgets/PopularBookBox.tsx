"use client"

import { PopularBookList } from "@/features/PopularBookList"

export const PopularBookBox = ({viewLength} : {viewLength? : number}) => {
    return (
        <article>
            <h3 className="inline-block font-[700] text-[1.2rem]">인기 도서</h3>
            <PopularBookList viewLength={viewLength}/>
        </article>
    )
}