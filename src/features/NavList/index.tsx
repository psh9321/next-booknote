"use client"

import Link from 'next/link';

import { House, User, Search, Send, Heart, BookUser, NotebookText, CirclePlus } from 'lucide-react';

import { useSession } from "next-auth/react"
import Image from 'next/image';

export const NavList = () => {

    const session = useSession();

    return (
        <nav>
            <ul className='
                flex
                justify-center
                gap-[20px]
                w-[500px]
                py-[20px]
                border-t 
                border-t-[#2a2f32]
                [&>li>*]:flex
                [&>li>*]:flex-col
                [&>li>*]:justify-between
                [&>li>*]:items-center
                [&>li>*]:min-w-[50px]
                [&>li>*]:h-[50px]
                [&>li>*]:text-[0.8rem]
                [&>li>*]:font-[700]
                [&>li>*>svg]:mb-[8px]
                '>
                <li>
                    <Link href={"/"}><House/>홈</Link>
                </li>
                <li>
                    <Link href={"/search/book"}><Search/>검색</Link>
                </li>
                {/* <li>
                    <Link href={""}><Send/>메세지</Link>
                </li> */}
                <li>
                    <Link href={""}>
                    <BookUser/>북클럽</Link>
                </li>
                <li>
                    <Link href={""}>
                    <NotebookText/>독서노트 피드</Link>
                </li>
                <li>
                    <button><Heart/>알림</button>
                </li>
                <li>
                    <Link href={"/my"}>
                    {
                        session && session.data?.user.profileImg ? <Image width={24} height={24} src={session.data?.user.profileImg} alt={`${session.data?.user.name} 프로필 이미지`} className='rounded-[100%]' loading="eager"/> : <User/>
                    }
                        내서재
                    </Link>
                </li>
            </ul>
        </nav>
    )
}