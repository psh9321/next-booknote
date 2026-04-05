"use client"

import { BookNoteItem } from "./ui/BookNoteItem";

interface BOOK_NOTE_LIST {
    bookcode : string
}

export const BookNoteList = ({ bookcode } : BOOK_NOTE_LIST) => {

    console.log("##@@",bookcode);

    return (
        <ol className="space-y-[50px]">
            <BookNoteItem value={"asd"} />            
        </ol>
    )
}