"use client"

import Link from 'next/link';

import { twMerge } from "tailwind-merge";

import { Search, BookMarked, CheckCircle, BookOpen } from 'lucide-react';

interface NAV_LIST extends LAYOUT_CHILD {
    className? : string
}

export const NavList = ({ className, children } : NAV_LIST) => {

    return (
        <ul className={twMerge(`flex justify-center gap-[20px] w-full py-[20px] select-none font-bold [&>li>*]:flex [&>li>*]:flex-col [&>li>*]:justify-between [&>li>*]:items-center [&>li>*]:min-w-[50px] [&>li>*]:h-[60px] [&>li>*]:text-[0.8rem] [&>li>*]:font-[700] [&>li>*>svg]:mb-[8px] [&>li>*>svg]:size-[28px] [@media(max-width:499px)]:gap-[10px] [@media(max-width:499px)]:[&>li>*]:w-auto [@media(max-width:499px)]:[&>li>*]:h-[45px] [@media(max-width:499px)]:[&>li>*>svg]:size-[25px] [@media(max-width:499px)]:[&>li>*]:text-[0.65rem] [@media(max-width:499px)]:[&>li>*]:min-w-[40px]`, className??"")}>

            <li><Link href={"/search"}><Search/>검색</Link></li>
            <li><Link href={"/my/read"}><BookOpen/>읽는 중</Link></li>
            <li><Link href={"/my/completed"}><CheckCircle/>완독</Link></li>
            <li><Link href={"/my/wish"}><BookMarked/>읽고 싶은 책</Link></li>
            {children}
        </ul>
    )
}
