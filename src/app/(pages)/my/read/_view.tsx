"use client"

import { MyBookListBox } from "@/widgets/MyBookListBox"

const MyReadBookPageView = () => {
    
    return (
        <>
            <h1 className="sr-only">내 서재 (읽고 있는 책) 페이지</h1>
            <MyBookListBox status={"READ"}/>
        </>
    )
}

export default MyReadBookPageView