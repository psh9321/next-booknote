"use client"

import { MyBookList } from "@/features/MyBookList"

const MyWishBookPageView = () => {
    
    return (
        <>
            <h1 className="sr-only">내 서재 (읽고 있는 책) 페이지</h1>
            <main>
                <section className="flex justify-center items-center">
                    <h2 className="sr-only">내가 읽고 있는 책 리스트</h2>
                    <MyBookList status={"WISH"}/>
                </section>
            </main>
        </>
    )
}

export default MyWishBookPageView