"use client"

import { SearchPageBtnBack } from '@/features/SearchBox/ui/SearchPageBtnBack';
import { SearchInput } from '@/features/SearchBox/ui/SearchInput';

export const SearchHead = () => {    
    return (
        <article className='flex justify-between items-center'>
            <h2 className="sr-only">상단 박스</h2>
            <SearchPageBtnBack/>
            <SearchInput className='w-[calc(100%-40px)]'/>
        </article>
    )
}