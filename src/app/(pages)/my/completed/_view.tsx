"use client"

import { MyBookListBox } from "@/widgets/my-page/MyBookListBox"

const MyCompletedBookPageView = () => {
    
    return (
        <>
            <h1 className="sr-only">내 서재 (완독 도서) 목록 페이지</h1>
            <MyBookListBox status="COMPLETED" />
        </>
    )
}

export default MyCompletedBookPageView