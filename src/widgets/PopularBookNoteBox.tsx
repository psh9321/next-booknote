"use client"

import { PopularBookNoteList } from "@/features/PopularBookNoteList"

export const PopularBookNoteBox = () => {

    return (
        <article className="w-full">
            <h3 className="inline-block font-[700] text-[1.2rem]">인기 북노트</h3>
            <PopularBookNoteList/>
        </article>
    )
}