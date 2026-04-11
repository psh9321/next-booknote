"use client"

import { useEffect, useState } from "react";

import useMediaQuery from "@parksuhyun9321/use-media-query";

import { MyBookPagePC } from "@/widgets/my-page/book/pc";
import { MyBookPageMobile } from "@/widgets/my-page/book/mobile";

interface MY_BOOK_TARGET_PAGE_VIEW {
    bookcode : string,
    status : READING_STATUS
}

const MyBookPageView = ({ bookcode, status } : MY_BOOK_TARGET_PAGE_VIEW) => {

    const { isResize } = useMediaQuery(790);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    },[]);

    if (!mounted) return <></>;

    return isResize ? <MyBookPageMobile bookcode={bookcode} status={status} /> : <MyBookPagePC bookcode={bookcode} status={status} />
}

export default MyBookPageView