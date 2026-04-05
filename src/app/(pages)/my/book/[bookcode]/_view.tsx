"use client"

import { BookNoteList } from "@/features/BookNoteList";
import { MyPageBookInfo } from "@/features/MyPageBookInfo"

import { Trash2, NotebookPen } from 'lucide-react';

import TextareaAutosize from "react-textarea-autosize";

interface MY_BOOK_TARGET_PAGE_VIEW {
    bookcode : string,
    status : READING_STATUS
}

const MyBookPageView = ({ bookcode, status } : MY_BOOK_TARGET_PAGE_VIEW) => {
    
    return (
        <main className="flex justify-between h-full">
            <section className="sticky top-[120px] self-start block w-[400px] h-full text-center">
                <h2 className="sr-only">해당 도서 정보</h2>
                <MyPageBookInfo bookcode={bookcode} status={status}/>
            </section>
            <section className="w-[calc(100%-460px)]">
                <h2 className="sr-only">해당 도서 독서노트</h2>
                <div className="sticky top-[100px] self-start w-full mt-[-20px] pt-[20px] bg-[#2a2f32] z-2">
                    <TextareaAutosize className="w-full min-h-[100px] p-[10px] border rounded-[6px]"/>
                    <ul className="flex justify-end gap-[10px] mt-[20px] [&>li>button]:h-[45px] [&>li>button]:px-[25px] [&>li>button]:border [&>li>button]:rounded-[8px]">
                        <li><button>작성 초기화</button></li>
                        <li><button className="bg-[#3b82f6] border-[#3b82f6]">작성</button></li>
                    </ul>
                </div>
                <article className="mt-[50px]">
                    <h2 className="sr-only">해당 도서 독서노트 리스트</h2>
                    <BookNoteList bookcode={bookcode} />
                </article>
            </section>
        </main>
    )
}

export default MyBookPageView