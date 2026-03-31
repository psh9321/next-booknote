"use client"

import Link from 'next/link';

import { useSession } from 'next-auth/react';

import { Book, SquareLibrary, NotebookText, BookUser, BookCheck, Bookmark } from 'lucide-react';

import { twMerge } from "tailwind-merge";

interface OPTION_LIST {
    className? : string
}

export const MyOptionList = ({ className } : OPTION_LIST) => {

    const session = useSession();

    const data = session.data?.user;

    return (
        <ul className={twMerge(`
            flex flex-wrap gap-y-[25px] w-[350px] mt-[60px] mx-[auto]
            [&>li]:w-[25%]
            [&>li]:text-center
            [&>li>a]:relative
            [&>li>a]:inline-flex
            [&>li>a]:flex-col
            [&>li>a]:items-center
            [&>li>a]:size-[60px]
            [&>li>a>span]:absolute
            [&>li>a>span]:top-[-20px]
            [&>li>a>span]:left-[-12px]
            [&>li>a>span]:inline-block
            [&>li>a>span]:size-[30px]
            [&>li>a>span]:leading-[30px]
            [&>li>a>span]:text-[0.9rem]
            [&>li>a>span]:font-bold
            [&>li>a>span]:text-center
            [&>li>a>span]:bg-[#888]
            [&>li>a>span]:rounded-[100%]
        `, className??"")}>
            <li>
                <Link href={"/my"}>
                {
                    (data && data.book > 0) && <span>{data.book}</span>
                }
                    <Book/>책
                </Link>
            </li>
            {/* <li>
                <Link href={""}>
                    <span>4</span>
                    <BookCheck/>완독도서
                </Link>
            </li> */}
            <li>
                <Link href={"/my/booknote"}>
                    {
                        (data && data.booknote > 0) && <span>{data.booknote}</span>
                    }
                    <NotebookText/>독서노트
                </Link>
            </li>
            <li>
                <Link href={"/my/scrap"}>
                    {
                        (data && data.scrapnote > 0) && <span>{data.scrapnote}</span>
                    }
                    <Bookmark/>
                    스크랩
                </Link>
            </li>
            <li>
                <Link href={"/my/bookclub"}>
                    {
                        (data && data.bookclub > 0) && <span>{data.bookclub}</span>
                    }
                    <BookUser/>북클럽
                </Link>
            </li>
            {/* <li>
                <Link href={"/"}>
                    <span>4</span>
                    <SquareLibrary/>
                    컬렉션
                </Link>
            </li> */}
        </ul>
    )
}