"use client"

import { useState } from "react"
import { BookPlus } from "lucide-react"

import { BestSellerCarouselList } from "@/features/BestSeller/CarouselList"
import { LatestReadBookList } from "@/features/LatestReadBookList"
import { MyOptionsBox } from "@/widgets/MyOptionsBox"
import { BookRegister } from "@/features/BookRegister"

const IndexPageView = () => {

    const [isRegisterOpen, setIsRegisterOpen] = useState(false)

    return (
        <>
            <section className="w-full mt-[20px]">
                <h3 className="inline-block mb-[20px] font-[700] text-[1.2rem]">베스트 셀러</h3>
                <div className="py-[40px] px-[20px] bg-[#2A2F32] rounded-[10px]">
                    <BestSellerCarouselList/>
                </div>
            </section>

            <main className="flex justify-between mt-[50px] [&>div]:space-y-[20px]">
                <h2 className="sr-only">내가 등록한 도서 목록</h2>
                <div className="w-[500px]">
                    <section className="mb-[50px]">
                        <h3 className=" mb-[20px] font-[700] text-[1.2rem]">최근 유저들이 등록한 도서</h3>
                        <div className="relative min-h-[340px] py-[40px] px-[20px] bg-[#2A2F32] rounded-[10px]">
                            <LatestReadBookList/>
                        </div>
                    </section>
                    <section>
                        <h3 className="inline-block mb-[20px] font-[700] text-[1.2rem]">최근 유저들이 등록한 독서노트</h3>
                        <div className="h-[900px] bg-[#2A2F32] rounded-[10px]">

                        </div>
                    </section>
                </div>
                <section className="sticky top-[50px] self-start block w-[420px]">
                    <h3 className="inline-block mb-[20px] font-[700] text-[1.2rem]">내 정보</h3>
                    <MyOptionsBox/>
                </section>
            </main>

            {isRegisterOpen && (
                <BookRegister onClose={() => setIsRegisterOpen(false)} />
            )}
        </>
    )
}

export default IndexPageView