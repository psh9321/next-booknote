import { MyBookList } from "@/features/MyBookList"

interface MY_BOOK_LIST_BOX {
    status : READING_STATUS
}

export const MyBookListBox = ({ status } : MY_BOOK_LIST_BOX) => {

    return (
        <main className="min-h-[calc(100dvh-210px)] mb-[110px] p-[20px] bg-[#2A2F32] rounded-[10px]">
            <section>
                <h2 className="sr-only">내가 읽고 있는 책 리스트</h2>
                <MyBookList status={status}/>
            </section>
        </main>
    )
}