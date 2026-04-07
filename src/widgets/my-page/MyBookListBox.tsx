"use client"

import { useSession } from "next-auth/react"
import { BeforeLoginMyBookList } from "@/features/my-book/ui/BeforLoginMyBookList"
import { AfterLoginMyBookList } from "@/features/my-book/ui/AfterLoginMyBookList"

interface MY_BOOK_LIST_BOX {
    status : READING_STATUS
}

export const MyBookListBox = ({ status } : MY_BOOK_LIST_BOX) => {

    const { status : isLogin } = useSession();

    return (
        <main className="min-h-[calc(100dvh-210px)] mb-[110px] p-[20px] bg-[#2A2F32] rounded-[10px]">
            <section>
                <h2 className="sr-only">내가 읽고 있는 책 리스트</h2>
                {
                    isLogin === "authenticated" ? 
                    <AfterLoginMyBookList status={status}/> :
                    <BeforeLoginMyBookList status={status} />
                }
            </section>
        </main>
    )
}
