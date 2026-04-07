"use client"

import { MyBookListBox } from "@/widgets/my-page/MyBookListBox"

const MyWishBookPageView = () => {
    
    return (
        <>
            <h1 className="sr-only">내 서재 (읽고 싶은 책 목록) 페이지</h1>
            <MyBookListBox status={"WISH"}/>
        </>
    )
}

export default MyWishBookPageView