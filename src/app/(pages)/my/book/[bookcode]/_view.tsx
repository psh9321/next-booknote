"use client"

import { useEffect } from "react";

import useMediaQuery from "@parksuhyun9321/use-media-query";

import { MyBookPagePC } from "@/widgets/MyBookPage/pc";
import { MyBookPageMobile } from "@/widgets/MyBookPage/mobile";

interface MY_BOOK_TARGET_PAGE_VIEW {
    bookcode : string,
    status : READING_STATUS
}

const MyBookPageView = ({ bookcode, status } : MY_BOOK_TARGET_PAGE_VIEW) => {

    const { isResize } = useMediaQuery(790);

    useEffect(() => {

    },[]);

    return isResize ? <MyBookPageMobile bookcode={bookcode} status={status} /> : <MyBookPagePC bookcode={bookcode} status={status} />
}

export default MyBookPageView