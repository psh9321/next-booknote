"use client"

import dynamic from "next/dynamic";

import useMediaQuery from "@parksuhyun9321/use-media-query";

const MyBookPagePC = dynamic(() => import("@/widgets/my-page/book/pc").then(rs => ({default : rs.MyBookPagePC})), { ssr : false });

const MyBookPageMobile = dynamic(() => import("@/widgets/my-page/book/mobile").then(rs => ({default : rs.MyBookPageMobile})), { ssr : false });

interface MY_BOOK_TARGET_PAGE_VIEW {
    bookcode : string,
    status : READING_STATUS
}

const MyBookPageView = ({ bookcode, status } : MY_BOOK_TARGET_PAGE_VIEW) => {

    const { isResize } = useMediaQuery(790);

    return (
        isResize ? <MyBookPageMobile bookcode={bookcode} status={status} /> : <MyBookPagePC bookcode={bookcode} status={status} />
    )
}

export default MyBookPageView