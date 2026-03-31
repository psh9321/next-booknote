"use client"

import Image from "next/image";
import { useRef } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from 'swiper/modules';

import type { SwiperClass } from "swiper/react"
import type { NavigationOptions } from 'swiper/types';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BOOK_NOTE_IMG_SLIDER extends LAYOUT_CHILD {
    data : string[],
    _id : string
}

export const BookNoteImgSlider = ({ data, children, _id } : BOOK_NOTE_IMG_SLIDER) => {

    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    function OnSlideChangeCallback(swiper: SwiperClass) {
        if (prevRef["current"]) prevRef["current"].disabled = swiper["isBeginning"];
        if (nextRef["current"]) nextRef["current"].disabled = swiper["isEnd"];
    }

    if(!data) return <></>

    return (
        <>
        {
            data.length > 1 && 
            <>
                <button ref={prevRef} className="left-[25px]"><ChevronLeft/></button>
                <button ref={nextRef} className="right-[25px]"><ChevronRight/></button>
            </>
        }
        <Swiper
            className="rounded-[10px]"
            modules={[Navigation, Pagination]}
            wrapperTag="ol"
            slidesPerView={1}
            navigation
            onBeforeInit={(swiper) => {
                (swiper.params.navigation as NavigationOptions).prevEl = prevRef.current;
                (swiper.params.navigation as NavigationOptions).nextEl = nextRef.current;
            }}
            onSlideChange={OnSlideChangeCallback}
        >
            {children}
            {
                data.map((img, i) => {
                    return (
                        <SwiperSlide tag="li" key={`${JSON.stringify(img)}-${i}`}>
                            <div className="flex justify-center items-center h-[250px] overflow-hidden">
                                <Image src={`${process.env.NEXT_PUBLIC_FILE_DIRECTORY}/${_id}/${img}`} alt={`asd ${i}`} width={450} height={550} style={{objectFit : "cover"}} unoptimized />
                            </div>
                        </SwiperSlide>
                    )
                })
            }
        </Swiper>
        </>
    )
}