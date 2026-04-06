"use client"

import { useSearchStore } from "@/features/SearchBox/store/useSearchStore";

import { BestSellerList } from "@/features/BestSeller/DefaultList"
import { SearchResult } from "@/features/SearchBox/ui/SearchResult";

export const SearchContents = () => {

    const keyword = useSearchStore(state => state.keyword);
    
    return (
        <section className="mt-[15px] select-none">
            <h3 className="block w-full h-[28px] font-[700] text-[1.2rem]">{ !keyword && "베스트 셀러" }</h3>
            {keyword ? <SearchResult/> : <BestSellerList/>}
        </section>
    )
}