"use client"

import { BestSellerList } from "@/features/BestSellerList"

export const BestSellerBox = () => {

    return (
        <article>
            <h3 className="inline-block font-[700] text-[1.2rem]">베스트 셀러 15</h3>

            <BestSellerList/>
        </article>
    )
}