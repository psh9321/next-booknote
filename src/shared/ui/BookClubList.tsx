"use client"

import Image from "next/image"

interface BOOK_CLUB_LIST {
    data : BOOK_CLUB_LIST[],
    className? : string
}

export const BookClubList = ({data, className} : BOOK_CLUB_LIST) => {
    return (
        <ol className="flex flex-wrap items-center gap-[20px] min-h-[400px] mt-[20px] py-[40px] px-[20px] bg-[#2A2F32] rounded-[10px]">
            {
                Array.from({length : 4}).map((_,i) => {
                    return (

                        <li key={`asd-${i}`} className="w-[calc(50%-10px)]" >
                            <div className="relative block w-full overflow-hidden rounded-[10px]">
                                <Image sizes="auto" width={120} height={100} loading="eager" src={"/dummy/image04.jpg"} alt="ads" className="object-cover rounded-[10px] mx-auto"/>
                            </div>
                            <h3 className="mt-[10px] text-center">북클럽 {i}</h3>
                        </li>
                    )
                })
            }

        </ol>
    )
}