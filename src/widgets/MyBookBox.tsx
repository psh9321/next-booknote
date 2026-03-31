"use client"

import { MyBookList } from "@/features/MyBookList"

export const MyBookBox = () => {
    return ( 
        <section className="w-[calc(100%-80px)] mx-auto">
            <h2 className="sr-only">내가 등록한 책 리스트</h2>
            <MyBookList />
        </section>
    )
}