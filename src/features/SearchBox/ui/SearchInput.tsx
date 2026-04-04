"use client"

import { useRef } from 'react';

import { CircleX } from 'lucide-react';

import { useSearchStore } from '../store/useSearchStore';
import { useShallow } from 'zustand/shallow';
import { useSearchBookHook } from '@/hooks/useQuery';

interface SEARCH_BOX {
    className? : string
}

export const SearchInput = ({ className } : SEARCH_BOX) => {

    const { keyword, SetKeyword } = useSearchStore(useShallow(state => ({
        keyword : state.keyword,
        SetKeyword : state.SetKeyword
    })));

    useSearchBookHook(keyword ?? "");

    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    function OnInputCallback(e : React.InputEvent<HTMLInputElement>){
        const value : string = e.currentTarget.value.replace(/ /g, '');

        if(debounceTimer["current"]) {
            clearTimeout(debounceTimer["current"]);
            debounceTimer["current"] = null;
        }

        debounceTimer["current"] = setTimeout(() => {
            SetKeyword(value ? value : null);
        }, 500)
    }

    function OnClickCallback() {
        if(!inputRef["current"]) return 

        inputRef["current"].value = "";
        SetKeyword(null);
    }
    
    return (
        <>
            <div className={`relative flex items-center bg-[#25292E] rounded-[10px] ${className??""}`}>
                <input ref={inputRef} defaultValue={keyword??""} onInput={OnInputCallback}  placeholder={"도서 검색"} className='w-[calc(100%-34px)] h-[40px] px-[10px]' type="text" />
                <button onClick={OnClickCallback} className='absolute top-1/2 right-[10px] -translate-y-1/2'>
                    <CircleX size={18}/>
                </button>
            </div>
        </>

    )
}