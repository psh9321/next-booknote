"use client"

import { MyBookListBox } from "@/widgets/MyBookListBox"

const MyWishBookPageView = () => {
    
    return (
        <>
            <h1 className="sr-only">내 서재 (읽고 있는 책) 페이지</h1>
            <MyBookListBox status={"WISH"}/>
        </>
    )
}

export default MyWishBookPageView