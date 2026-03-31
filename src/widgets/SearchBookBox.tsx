"use client"

import { ChevronLeft } from "lucide-react"

import { SearchBox } from "@/features/SearchBox"
import { useRouter } from 'next/navigation';

export const SearchBookBox = () => {

    const navigation = useRouter();

    function BtnCallback() { navigation.back() }
    
    return (
        <article className='flex justify-between items-center'>
            <h2 className="sr-only">도서 검색 박스</h2>
            <button onClick={BtnCallback}><ChevronLeft className='size-[30px]'/></button>
            <SearchBox type="book" className='w-[calc(100%-40px)]'/>
        </article>
    )
}