"use client"

import { PopularBookClubList } from "@/features/PopularBookClubList"

export const PopularBookClubBox = () => {
    
    return (
        <article>
            <h3 className="inline-block font-[700] text-[1.2rem]">인기 북클럽</h3>
            <PopularBookClubList/>
        </article>
    )
}