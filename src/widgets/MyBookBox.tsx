"use client"

import { MyBookList } from "@/features/MyBookList"

interface MY_BOOK_BOX {
    userId : string
}

export const MyBookBox = ({ userId } : MY_BOOK_BOX) => {
    return (
        <section className="w-full p-[20px]">
            <h2 className="sr-only">내가 등록한 책 리스트</h2>
            <MyBookList userId={userId} />
        </section>
    )
}