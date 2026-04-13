"use client"

import { useSearchStore } from "@/features/search-book/store/useSearchStore";

import { BestSellerList } from "@/features/best-seller/ui/DefaultList"
import dynamic from "next/dynamic";

const SearchResult = dynamic(() => import("@/features/search-book/ui/SearchResult").then(m => m.SearchResult));

export const SearchContents = () => {

    const keyword = useSearchStore(state => state.keyword);

    return (
        <section className="mt-[15px] select-none">
            <h3 className="block w-full h-[28px] font-[700] text-[1.2rem]">{ !keyword && "베스트 셀러" }</h3>
            {keyword ? <SearchResult/> : <BestSellerList/>}
        </section>
    )
}
