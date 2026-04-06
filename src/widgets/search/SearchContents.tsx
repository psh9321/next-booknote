"use client"

import { useSearchStore } from "@/features/search-book/model/useSearchStore";

import { BestSellerList } from "@/features/best-seller/ui/DefaultList"
import { SearchResult } from "@/features/search-book/ui/SearchResult";

export const SearchContents = () => {

    const keyword = useSearchStore(state => state.keyword);

    return (
        <section className="mt-[15px] select-none">
            <h3 className="block w-full h-[28px] font-[700] text-[1.2rem]">{ !keyword && "베스트 셀러" }</h3>
            {keyword ? <SearchResult/> : <BestSellerList/>}
        </section>
    )
}
