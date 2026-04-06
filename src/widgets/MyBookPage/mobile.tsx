"use client"

import { AddBookNote } from "@/features/AddBookNote/AddBookNote";
import { BookNoteList } from "@/features/BookNoteList";
import { MyPageBookInfo } from "@/features/MyPageBookInfo"
import { useState } from "react";

interface MY_BOOK_PAGE_MOBILE {
    bookcode : string,
    status : READING_STATUS
}

export const MyBookPageMobile = ({ bookcode, status } : MY_BOOK_PAGE_MOBILE) => {

    const [currentChapter, SetCurrentChapter] = useState<0 | 1>(0);

    function ChapterMoveCallback(e : React.UIEvent<HTMLButtonElement>) {

        const self = e.currentTarget;

        SetCurrentChapter(Number(self.dataset.chapter) as 0 | 1)
    }

    return (
        <div className="w-full h-[calc(100dvh-210px)] bg-[#2A2F32]">
            <ul className="relative flex [&>li]:w-1/2 [&>li>button]:block [&>li>button]:w-full [&>li>button]:py-[20px] [&>li>button.active]:text-[#000] [&>li>button.active]:bg-[#fff]">
                <li><button onClick={ChapterMoveCallback} data-chapter="0" className={`${currentChapter === 0 && "active"}`}>도서정보</button></li>
                <li><button onClick={ChapterMoveCallback} data-chapter="1" className={`${currentChapter === 1 && "active"}`}>독서노트</button></li>
            </ul>
            {/* header(100px) + footer(100px) + button list(64px) = 264px / mobile <500px footer(85px) = 249px */}
            <main className="w-full h-[calc(100%-64px)] pt-[20px] overflow-hidden">
                <div style={{ left : `-${currentChapter*100}%`, transition : "0.25s ease"}} className={`relative flex h-full`}>
                    <section className="shrink-0 w-full h-full p-[20px] text-center overflow-y-auto">
                        <h2 className="sr-only">해당 도서 정보</h2>
                        <MyPageBookInfo bookcode={bookcode} status={status}/>
                    </section>
                    <section className="shrink-0 relative w-full h-full overflow-y-auto">
                        <h2 className="sr-only">해당 도서 독서노트</h2>
                        <div className="sticky top-[0] p-[20px] z-[1] bg-[#2A2F32]">
                            <AddBookNote bookcode={bookcode}/>
                        </div>
                        <div className="h-[calc(100%-64px)] mt-[20px] px-[20px]">
                            <BookNoteList bookcode={bookcode} />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}