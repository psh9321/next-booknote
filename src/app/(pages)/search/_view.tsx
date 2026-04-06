"use client"

import { SearchHead } from '@/widgets/search/SearchHead';
import { SearchContents } from '@/widgets/search/SearchContents';
import { Footer } from '@/widgets/footer';


const SearchPageView = () => {

    return (
        <>
            <h1 className="sr-only">도서 검색</h1>
            <main className="w-[500px] h-full mx-auto py-[30px] [@media(max-width:520px)]:w-[calc(100%-30px)]">
                <div className='pb-[80px]'>
                    <SearchHead/>
                    <SearchContents/>
                </div>
                <Footer/>
            </main>
        </>
    )
}

export default SearchPageView