"use client"

import { useEffect, useRef } from "react";

import { twMerge } from "tailwind-merge"

import { ScanSearch, Route, FilePen, FileXCorner, FilePenLine, FileStack, BookCopy, LibraryBig } from 'lucide-react';


interface LOADING_ICON extends LAYOUT_CHILD {
    className? : string
}

const LoadingIcon = ({ children, className } : LOADING_ICON) => {

    const parentRef = useRef<HTMLDivElement>(null);

    const animationRef = useRef<HTMLSpanElement>(null);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if(!parentRef["current"]) return
        if(!animationRef["current"]) return 

        const element = animationRef["current"];

        intervalRef["current"] = setInterval(() => {
            if(element.textContent && element.textContent.length >= 3) element.innerHTML=""
            element.append(".")
        }, 250);

        const parentElement = parentRef["current"];

        parentElement.style.bottom = visualViewport ? `${window.innerHeight - visualViewport["height"] + 50}px` : "50px";
         
        return () => {
            if(intervalRef["current"]) clearInterval(intervalRef["current"]);
        }
    },[]);

    return (
        <div className="fixed top-0 left-0 block w-full h-full z-9999999 select-none">
            <div ref={parentRef} className={twMerge("absolute bottom-[-100%] left-1/2 -translate-x-1/2 inline-block w-[150px] h-[90px] text-center bg-[#091257] rounded-[20px] transition-[0.25s] shadow-[3px_3px_3px_3px_rgba(0,0,0,0.8)]", className??"")}>
                <p className="absolute top-[15px] flex justify-center items-center gap-[10px] w-full text-[#fff] text-[22px] font-bold [&>svg]:size-[30px] [&>svg]:stroke-[#fff]">
                    {children}                    
                </p>
                <span ref={animationRef} className="relative inline-block text-[65px] rounded-[10px]">.</span>
            </div>
        </div>
    )
}

/** 책검색 시 아이콘 */
export const SearchLoadingIcon = () => {
    return (
        <LoadingIcon>
            <ScanSearch/>검색중
        </LoadingIcon>
    )
}

/** 상세 페이지 접근 시 아이콘 */
export const RouteLoadingIcon = () => {

    return (
        <LoadingIcon>
            <Route/>로딩중
        </LoadingIcon>
    )   
}

/** 독서노트 등록 시 아이콘 */
export const BookNoteAddIcon = () => {
    return (
        <LoadingIcon>
            <FilePen/>등록중
        </LoadingIcon>
    )   
}

/** 독서노트 삭제 시 아이콘 */
export const BookNoteDeleteIcon = () => {
    return (
        <LoadingIcon>
            <FileXCorner/>삭제중
        </LoadingIcon>
    )   
}

/** 독서노트 수정 시 아이콘 */
export const BookNoteUpdateIcon = () => {
    return (
        <LoadingIcon>
            <FilePenLine/>수정중
        </LoadingIcon>
    )   
}

/** 독서노트 요청 시 아이콘 */
export const BookNoteFetchIcon = () => {
    return (
        <LoadingIcon className="w-[300px]">
            <FileStack/>독서노트 불러오는 중
        </LoadingIcon>
    )   
}

/** 도서 요청 시 아이콘 */
export const BookFetchIcon = () => {
    return (
        <LoadingIcon className="w-[300px]">
            <BookCopy/>도서 불러오는 중
        </LoadingIcon>
    )   
}

/** 독서 상태 처리 시 아이콘 */
export const BookRegisterIcon = () => {
    return (
        <LoadingIcon className="w-[300px]">
            <LibraryBig/>독서 상태 처리중
        </LoadingIcon>
    )   
}