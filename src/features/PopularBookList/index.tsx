"use client"

import { useState, useEffect } from "react";
import { usePopularBookHook } from "@/hook/useQuery"
import { BookList } from "@/shared/ui/BookList";

interface POPULAR_BOOK_LIST {
    viewLength? : number
}

export const PopularBookList = ({ viewLength } : POPULAR_BOOK_LIST) => {

    const { data, isSuccess } = usePopularBookHook();

    const [mounted, setMounted] = useState(false);

    const [bookData, SetBookData] = useState<BOOK_ITEM[]>(data as BOOK_ITEM[]);

    useEffect(() => {
        setMounted(true);

        if(!isSuccess) return SetBookData([])

        if(viewLength) {

            SetBookData(prev => {

                const result = [...data as BOOK_ITEM[]]

                for(let i = 0; i < result.length; i++) {
                    const j = Math.floor(Math.random() * (i + 1));

                    [prev[i], prev[j]] = [prev[j], prev[i]];
                }

                return result.slice(0,viewLength)
            })
        }

    }, []);

    if(!mounted) return <></>;
    
    if(!isSuccess) return <></>

    return <BookList data={bookData} />
}