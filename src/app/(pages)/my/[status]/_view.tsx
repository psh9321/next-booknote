"use client"

import { MyBookList } from "@/features/MyBookList"

interface MY_BOOK_PAGE_VIEW {
    status : READING_STATUS
}

const MyBookPageView = ({ status } : MY_BOOK_PAGE_VIEW) => {
    
    return (
        <>
            <h1 className="sr-only">내 서재 (읽고 있는 책) 페이지</h1>
            <main>
                <section className="">
                    <h2 className="sr-only">내가 읽고 있는 책 리스트</h2>
                    <MyBookList status={status}/>
                </section>
            </main>
        </>
    )
}

export default MyBookPageView