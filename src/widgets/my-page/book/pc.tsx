"use client"

import { useSession } from "next-auth/react";

import { AddBookNote } from "@/features/book-note/ui/AddBookNote";
import { BookNoteList } from "@/features/book-note/ui/BookNoteList";
import { MyPageBookInfo } from "@/features/book-info/ui/MyPageBookInfo"

import { BeforLoginLayer } from "@/shared/ui/BeforLoginLayer";

interface MY_BOOK_PAGE_PC {
    bookcode : string,
    status : READING_STATUS
}

export const MyBookPagePC = ({bookcode, status} : MY_BOOK_PAGE_PC) => {

    const { status : isLogin } = useSession();

    return (
        <main className="flex justify-between h-[calc(100dvh-210px)] p-[20px] bg-[#2A2F32] rounded-[10px]">
            <section className="sticky top-[120px] self-start block w-[400px] h-full text-center">
                <h2 className="sr-only">해당 도서 정보</h2>
                <MyPageBookInfo bookcode={bookcode} status={status}/>
            </section>
            <section className="relative w-[calc(100%-470px)]">
                <h2 className="sr-only">해당 도서 독서노트</h2>
                {
                    isLogin === "unauthenticated" && <BeforLoginLayer className="rounded-[5px]"/>
                }
                <div className="sticky top-[100px] self-start w-full mt-[-20px] pt-[20px] z-2">
                    <AddBookNote bookcode={bookcode}/>
                </div>
                <div className="mt-[50px]">
                    <BookNoteList bookcode={bookcode} />
                </div>
            </section>
        </main>
    )
}
