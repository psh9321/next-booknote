"use client"

import { SearchHead } from '@/widgets/SearchHead';
import { SearchContents } from '@/widgets/SearchContents';

const SearchPageView = () => {

    return (
        <>
            <h1 className="sr-only">도서 검색</h1>
            <main className="w-[500px] h-full mx-auto py-[30px]">
                <SearchHead/>
                <SearchContents/>
            </main>
        </>
    )
}

export default SearchPageView