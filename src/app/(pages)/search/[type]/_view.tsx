"use client"

import { SearchBookBox } from "@/widgets/SearchBookBox"
import { SearchResultBox } from "@/widgets/SearchResultBox"

interface SEARCH_PAGE_VIEW {
    type : SEARCH_PARAMS_TYPE
}

const SearchPageView = ({ type } : SEARCH_PAGE_VIEW) => {

    const pageTitle = (() : string => {
        switch (type) {
            case "book": return "도서 검색";
            case "bookclub" : return "북클럽 검색";
            case "user" : return "유저 검색";
            default: return `쿼리파라미터 에러 ${type}`
        }
    })()
    
    return (
        <>
            <h1 className="sr-only">{pageTitle}</h1>
            <main className="w-[500px] h-full mx-auto">
                <section>
                    <h2 className="sr-only">상단 박스</h2>
                    <SearchBookBox/>
                </section>
                <section className="h-[calc(100%-50px)] mt-[30px] overflow-y-auto">
                    <h2 className="sr-only">하단 박스</h2>
                    <SearchResultBox type={type}/>
                </section>
            </main>        
        </>
    )
}

export default SearchPageView