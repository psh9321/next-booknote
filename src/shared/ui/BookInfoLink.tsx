"use client"

import Link from "next/link";

import { useLoadingStore } from "../store/useLoadingStore";

interface BOOK_INFO_LINK extends LAYOUT_CHILD {
    href : string,
    className? : string
}

export const BookInfoLink = ({ href, className, children } : BOOK_INFO_LINK) => {

    const SetLoadingStatus = useLoadingStore(state => state.SetLoadingStatus);

    function AnchorCallback() { SetLoadingStatus("route") }

    return (
        <Link className={className??""} scroll={false} onClick={AnchorCallback} href={href} >{children}</Link>
    )
}