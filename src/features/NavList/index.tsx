"use client"

import Link from 'next/link';
import Image from 'next/image';

import { twMerge } from "tailwind-merge";

import { House, User, Search, BookMarked, CheckCircle, BookOpen } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface NAV_LIST extends LAYOUT_CHILD {
    className? : string    
}

export const NavList = ({ className, children } : NAV_LIST) => {

    const pathname = usePathname();

    return (
        <ul className={twMerge(`flex justify-center gap-[20px] w-[500px] py-[20px] [&>li>*]:flex [&>li>*]:flex-col [&>li>*]:justify-between [&>li>*]:items-center [&>li>*]:min-w-[50px] [&>li>*]:h-[60px] [&>li>*]:text-[0.8rem] [&>li>*]:font-[700] [&>li>*>svg]:mb-[8px] [&>li>*>svg]:size-[28px]`, className??"")}>
            {
                pathname !== "/" && <li><Link href={"/"}><House/>홈</Link></li>
            }
            {
                !pathname.includes("search") && <li><Link href={"/search"}><Search/>검색</Link></li>
            }
            {
                !pathname.includes("my/read") &&  <li><Link href={"/my/read"}><BookOpen/>읽는 중</Link></li>    
            }
            {
                !pathname.includes("my/completed") &&  <li><Link href={"/my/completed"}><CheckCircle/>완독</Link></li>    
            }
            {
                !pathname.includes("my/wish") &&  <li><Link href={"/my/wish"}><BookMarked/>읽고 싶은 책</Link></li>
            }
            {children}
        </ul>
    )
}