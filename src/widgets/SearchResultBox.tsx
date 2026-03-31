"use client"

import { PopularBookBox } from "./PopularBookBox"
import { useSearchStore } from "@/features/SearchBox/store/useSearchStore"
import { SearchResult } from "@/features/SearchResult"

interface SEARCH_RESULT {
    type : SEARCH_PARAMS_TYPE
}

export const SearchResultBox = ({ type } : SEARCH_RESULT) => {

    const keyword = useSearchStore(state => state.keyword);

    return (
        <>
            <div className="fixed bottom-[101px] left-1/2 -translate-x-1/2 w-[500px] h-[calc(100%-240px)] rounded-[10px] bg-[#2a2f32] -z-1"></div>
            {
                keyword ? <SearchResult type={type} /> : <PopularBookBox/> 
            }
        </>
    )
}