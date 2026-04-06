"use client"

import { useRouter } from 'next/navigation';

import { ChevronLeft } from "lucide-react"

export const SearchPageBtnBack = () => {
    const navigation = useRouter();

    function BtnCallback() { navigation.back() };

    return (
        <button onClick={BtnCallback}><ChevronLeft className='size-[30px]'/></button>
    )
}
