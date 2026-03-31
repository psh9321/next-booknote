"use client"

import { MyBookBox } from "@/widgets/MyBookBox";

const MyBookPageView = () => {

    return (
        <>
            <h1 className="sr-only">내 서재 (등록한 책) 페이지</h1>
            <main>
                <MyBookBox/>
            </main>
        </>
    )
}

export default MyBookPageView
