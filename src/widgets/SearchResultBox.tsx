"use client"

import { PopularBookList } from "@/features/PopularBookList"
import { PopularBookBox } from "./PopularBookBox"
import { useSearchStore } from "@/features/SearchBox/store/useSearchStore"
import { SearchResult } from "@/features/SearchResult"

interface SEARCH_RESULT {
    type : SEARCH_PARAMS_TYPE
}

export const SearchResultBox = ({ type } : SEARCH_RESULT) => {

    const keyword = useSearchStore(state => state.keyword);

    return (
        <div className="">
            {/* <div className="fixed bottom-[101px] left-1/2 -translate-x-1/2 w-[500px] h-[calc(100%-240px)] rounded-[10px] bg-[#2a2f32] -z-1"></div> */}
            {
                <h3 className="block w-full h-[28px] font-[700] text-[1.2rem]">{ !keyword && "인기도서" }</h3>
            }
    
            <div className="min-h-[calc(100dvh-240px)] mt-[20px] bg-[#2a2f32] rounded-[10px]">
                {
                    keyword ? <SearchResult type={type} /> : <PopularBookList/>
                }
            </div>
        </div>
    )
}