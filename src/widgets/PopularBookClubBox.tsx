"use client"

import { PopularBookClubList } from "@/features/PopularBookClubList"

export const PopularBookClubBox = () => {
    
    return (
        <article className="bg-[#2A2F32] rounded-[10px]">
            <h2 className="sr-only">인기 북클럽 리스트</h2>
            <PopularBookClubList/>
        </article>
    )
}