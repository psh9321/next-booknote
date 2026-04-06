"use client"

import { useEffect, useState } from "react"
import useMediaQuery from "@parksuhyun9321/use-media-query"

import { BestSellerCarouselList } from "@/features/best-seller/ui/CarouselList"
import { LatestBookList } from "@/widgets/home/LatestBookList"
import { MyOptionsBox } from "@/widgets/my-page/MyOptionsBox"
import { LatestBookNoteList } from "@/widgets/home/LatestBookNoteList"
import { Footer } from "@/widgets/footer"

const IndexPageView = () => {

    const [ isMounded, SetIsMounded ] = useState(false);
    const { isResize } = useMediaQuery(950);

    useEffect(() => {
        SetIsMounded(true);
    }, []);

    // SSR에서 라이브러리가 isResize=true를 기본값으로 사용하므로,
    // 마운트 전까지 true로 고정해 hydration 불일치 방지
    const effectiveIsResize = isMounded ? isResize : true;

    return (
        <div className={`block w-[1000px] mx-auto ${effectiveIsResize ? "pb-[120px]" : "pb-[20px]"} [@media(max-width:1000px)]:w-[calc(100%-40px)]`}>
            <section className="w-full mt-[20px]">
                <h3 className="inline-block mb-[20px] font-[700] text-[1.2rem] select-none">베스트 셀러</h3>
                <div className="py-[40px] px-[20px] bg-[#2A2F32] rounded-[10px]">
                    <BestSellerCarouselList/>
                </div>
            </section>

            <main className="flex justify-between mt-[50px] [&>div]:space-y-[20px] [@media(max-width:950px)]:flex-col [@media(max-width:950px)]:justify-center [@media(max-width:950px)]:items-center">
                <h2 className="sr-only">내가 등록한 도서 목록</h2>
                <div className="w-[450px] [@media(max-width:500px)]:w-full">
                    <section>
                        <h3 className="inline-block mb-[20px] font-[700] text-[1.2rem] select-none">최근 내가 등록한 독서노트</h3>
                        <div className= "p-[20px] bg-[#2A2F32] rounded-[10px]">
                            <LatestBookNoteList/>
                        </div>
                    </section>
                    <section className="mt-[50px]">
                        <h3 className="mb-[20px] font-[700] text-[1.2rem] select-none">최근 유저들이 등록한 도서</h3>
                        <div className="relative min-h-[340px] py-[40px] px-[20px] bg-[#2A2F32] rounded-[10px]">
                            <LatestBookList/>
                        </div>
                    </section>
                </div>
                {
                    !effectiveIsResize &&
                    <section className="sticky top-[50px] self-start block w-[420px]">
                        <h3 className="inline-block mb-[20px] font-[700] text-[1.2rem] select-none">내 정보</h3>
                        <MyOptionsBox/>
                    </section>
                }

            </main>

            { effectiveIsResize && <Footer/> }
        </div>
    )
}

export default IndexPageView