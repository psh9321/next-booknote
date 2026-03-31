"use client"

import { BestSellerBox } from "@/widgets/BestSellerBox"
import { MyOptionsBox } from "@/widgets/MyOptionsBox"
import { PopularBookBox } from "@/widgets/PopularBookBox"
import { PopularBookClubBox } from "@/widgets/PopularBookClubBox"
import { PopularBookNoteBox } from "@/widgets/PopularBookNoteBox"

const IndexPageView = () => {
    
    return (
        <>
            <h1 className="sr-only">메인 인덱스 페이지</h1>
            <BestSellerBox/>
            <main className="flex flex-wrap justify-between gap-[20px] mt-[60px]">
                <section className="w-[680px]">
                    <h3 className="inline-block mb-[20px] font-[700] text-[1.2rem]">인기 도서</h3>
                    <PopularBookBox viewLength={2}/>            
                </section>
                <section className="w-[calc(100%-700px)]">
                    <h3 className="inline-block mb-[20px] font-[700] text-[1.2rem]">인기 북클럽</h3>
                    <PopularBookClubBox/>
                </section>
                <section className="flex justify-between gap-[20px] w-full mt-[30px]">
                    <div className="w-[calc(50%-10px)]">
                        <PopularBookNoteBox/>
                    </div>
                    <div className="sticky top-[50px] self-start w-[calc(50%-10px)]">
                        <MyOptionsBox/>
                    </div>
                </section>
            </main>  
        </>

    )
}

export default IndexPageView