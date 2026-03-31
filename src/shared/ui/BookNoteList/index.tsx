"use client"

import Image from "next/image";

import { Heart, Bookmark } from 'lucide-react';

import { GetTimeAgo } from "@/shared/util/getTimeAgo";
import { BookNoteImgSlider } from "@/shared/ui/BookNoteImgSlider";

interface BOOK_NOTE_LIST {
    data : BOOK_NOTE_ITEM[],
    className? : string
}

export const BookNoteList = ({ data, className } : BOOK_NOTE_LIST) => {

    if(!data) return <></>

    return (
        <ul className={`mt-[20px] py-[40px] px-[20px] bg-[#2A2F32] rounded-[10px] ${className??""}`}>
            {
                data.map((el, i) => {
                    return (
                        <li key={`${el["noteTitle"]}-${i}`} className="w-[450px]">
                            <div className="relative mt-[20px] py-[40px] px-[20px] bg-[#2A2F32] rounded-[10px]

                                [&>button]:absolute
                                [&>button]:top-1/2
                                [&>button]:-translate-y-1/2
                                [&>button]:z-10
                                [&>button]:size-[20px]
                                [&>button]:flex
                                [&>button]:items-center
                                [&>button]:justify-center
                                [&>button]:rounded-full
                                [&>button]:bg-gray-200
                                [&>button]:hover:bg-gray-300
                                [&>button]:cursor-pointer
                                [&>button]:shadow-[0_0px_10px_rgba(0,0,0,0.5)]
                                [&>button:disabled]:opacity-30
                                [&>button:disabled]:cursor-not-allowed
                                [&>button>svg]:stroke-[#000]
                                [&>button>svg]:size-[18px]
                            ">

                                <div className='flex items-center mb-[15px]'>
                                    <div className='w-[40px] h-[40px] bg-[#f0f] rounded-[100%]'></div>
                                    <dl className='flex items-end ml-[10px] text-[1.1rem]'>
                                        <dt>{el["writerName"]}</dt>
                                        <dd className="ml-[7px] text-[0.8rem]">{GetTimeAgo(el["createDate"])}</dd>
                                    </dl>
                                </div>
                                <BookNoteImgSlider data={el["contentsImages"]} _id={el._id}>
                                    <button className="absolute top-[10px] right-[10px] flex justify-center items-center w-[40px] h-[40px] rounded-[100%] overflow-hidden z-2">
                                        <Image src={el["bookCover"]} alt={`${el["bookTitle"]} 커버 이미지`} fill sizes="auto" className="object-cover rounded-[10px]" />
                                    </button>
                                </BookNoteImgSlider>

                                <ul className="flex justify-between my-[15px] [&>li>button]:flex">
                                    <li>
                                        <button className="flex items-center"><Heart/> <span className="ml-[5px] text-[0.9rem]">{el["favorite"]}</span></button>
                                    </li>
                                    <li>
                                        <button>
                                            <Bookmark/>
                                            <span className="ml-[5px] text-[0.9rem]">{el["scrap"]}</span>
                                        </button>
                                    </li>
                                </ul>
                                <p className="w-full leading-[1.7] truncate min-w-0">{el["noteContents"]}</p>
                            </div>
                        </li>
                    )
                })
            }
        </ul>
    )
}