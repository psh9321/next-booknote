"use client"

import Image from "next/image";
import Link from "next/link";

import { useSession } from "next-auth/react"

import { Heart, Bookmark, Copy } from 'lucide-react';

import { useMyScrapBookNoteQueryHook } from "@/hook/useQuery";

const MyBookNoteScrapPageView = () => {

    const session = useSession();

    const { data } = useMyScrapBookNoteQueryHook(session.data?.user.id);

    return (
        <>
            <h1 className="sr-only">내 서재 (내 독서노트) 페이지 </h1>
            <main>
                <section className="w-[calc(100%-80px)] mx-auto">
                    <h2 className="sr-only">ㅇㅇㅇ</h2>
                    <ul className="flex flex-wrap w-full">
                    {
                        data?.pages.map(page => {

                            if(!page) return

                            const list = (page as MY_SCRAP_BOOK_NOTE)["list"];

                            return list.map((el, i) => {
                                return (
                                    <li key={`내가등록한도서-${el["_id"]}-${i}`} className="group w-[25%] border-1 border-[#0c1014]">
                                        <Link href={""} className="relative block w-full h-[300px]">
                                            
                                            { el["contentsImages"].length > 1 && <Copy size={18} className="absolute top-[5px] right-[5px] z-[1]" /> }

                                            <Image width={40} height={40} loading="lazy" src={el["bookCover"]} alt={`${el["_id"]}-도서커버이미지`} className="absolute top-[5px] left-[5px] block w-[40px] h-[40px] rounded-[100%] object-cover z-[1]" />
                                            
                                            <Image sizes="auto" loading="eager" src={`${process.env.NEXT_PUBLIC_FILE_DIRECTORY}/${el["booknoteId"]}/${el["contentsImages"][0]}`} alt={`${el["_id"]}-이미지`} fill className="object-cover" unoptimized />

                                            <div className="absolute flex justify-center items-center w-full h-full bg-[rgba(0,0,0,0.7)] space-x-[20px] [&>span]:flex [&>span>svg]:mr-[5px] opacity-0 group-hover:opacity-100 transition-opacity duration-100 z-[2]">
                                                <span><Heart/> {el["favorite"]}</span>
                                                <span><Bookmark/> {el["scrap"]}</span>
                                            </div>
                                        </Link>
                                    </li>
                                )
                            })
                        })
                    }
                    </ul>
                </section>

            </main>
        </>
    )
}

export default MyBookNoteScrapPageView