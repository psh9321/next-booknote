"use client"

import { useState, useEffect } from "react";
import { usePopularBookNoteFeedHook } from "@/hook/useQuery"

import { BookNoteList } from "@/shared/ui/BookNoteList";

export const PopularBookNoteList = () => {

    const { data, isSuccess } = usePopularBookNoteFeedHook();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <></>;

    return isSuccess ? <BookNoteList data={data as BOOK_NOTE_ITEM[]} /> : <></>
}