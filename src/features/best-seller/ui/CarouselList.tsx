"use client";

import Image from "next/image";
import Link from "next/link";

import { useRef } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from 'swiper/modules';
import type { NavigationOptions } from 'swiper/types';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { useBestSellerHook } from "@/entities/book/hooks/useBestSellerHook";

export const BestSellerCarouselList = () => {

    const { data, isError } = useBestSellerHook();

    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);

    const SetNavBtnsCallback = (swiper: { isBeginning: boolean; isEnd: boolean }) => {
        if (prevRef.current) prevRef.current.disabled = swiper.isBeginning;
        if (nextRef.current) nextRef.current.disabled = swiper.isEnd;
    };

    if(isError || !data) return <></>;

    return (
        <div className="flex items-center gap-4 select-none [&>button]:shrink-0 [&>button]:w-8 [&>button]:h-8 [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:bg-gray-200 [&>button]:hover:bg-gray-300 [&>button:disabled]:opacity-30 [&>button:disabled]:cursor-not-allowed [&>button>svg]:stroke-[#000]">

            <button ref={prevRef}><ChevronLeft/></button>
            <button ref={nextRef} className="order-last"><ChevronRight/></button>

            <Swiper
                modules={[Navigation]}
                wrapperTag="ol"
                slidesPerView={2}
                spaceBetween={15}
                breakpoints={{
                    550:  { slidesPerView: 3, spaceBetween: 20 },
                    700: { slidesPerView: 4, spaceBetween: 25 },
                    1000: { slidesPerView: 5, spaceBetween: 25 },
                }}
                className="w-full"
                navigation
                onBeforeInit={(swiper) => {
                    (swiper.params.navigation as NavigationOptions).prevEl = prevRef.current;
                    (swiper.params.navigation as NavigationOptions).nextEl = nextRef.current;
                }}
                onInit={SetNavBtnsCallback}
                onSlideChange={SetNavBtnsCallback}
            >

                {
                    (data as ALADIN.ALADIN_ITEM[]).map((el, i) => (
                        <SwiperSlide tag="li" key={`${JSON.stringify(el)}-${i}`}>
                            <Link href={`/book/${el["isbn"]}`}>
                                <div className="relative aspect-[3/4]">
                                    <Image
                                        fill
                                        src={el["cover"]}
                                        alt={`${el["title"]} 커버 이미지`}
                                        sizes="(max-width: 550px) 50vw, (max-width: 700px) 25vw, 20vw"
                                        loading="eager"
                                        className="rounded-[10px] object-cover"
                                    />
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    );
};
