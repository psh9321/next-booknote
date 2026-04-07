"use client"

import { MyBookListBox } from "@/widgets/my-page/MyBookListBox"

const MyReadBookPageView = () => {
    
    return (
        <>
            <h1 className="sr-only">내 서재 (읽고 있는 책 목록) 페이지</h1>
            <MyBookListBox status={"READ"}/>
        </>
    )
}

export default MyReadBookPageView