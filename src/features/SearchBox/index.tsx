"use client"

import { useRef } from 'react';

import { CircleX } from 'lucide-react';

import { useSearchResultQueryHook } from '@/hook/useQuery';
import { useSearchStore } from './store/useSearchStore';
import { useShallow } from 'zustand/shallow';


interface SEARCH_BOX {
    type : SEARCH_PARAMS_TYPE,
    className? : string
}

export const SearchBox = ({ type, className } : SEARCH_BOX) => {

    const { keyword, SetKeyword } = useSearchStore(useShallow(state => ({
        keyword : state.keyword,
        SetKeyword : state.SetKeyword
    })))

    const debounceTimer = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const placehoder = (() => {
        switch (type) {
            case "book": return "도서 검색"
            case "bookclub": return "북클럽 검색"
            case "user": return "유저 검색"

            default : return ""
        }
    })();

    useSearchResultQueryHook(type, keyword);

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
                <input ref={inputRef} defaultValue={keyword??""} onInput={OnInputCallback}  placeholder={placehoder} className='w-[calc(100%-34px)] h-[40px] px-[10px]' type="text" />
                <button onClick={OnClickCallback} className='absolute top-1/2 right-[10px] -translate-y-1/2'>
                    <CircleX size={18}/>
                </button>
            </div>
        </>

    )
}