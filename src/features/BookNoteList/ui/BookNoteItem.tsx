"use client"

import { Trash2, NotebookPen } from 'lucide-react';

import TextareaAutosize from "react-textarea-autosize";

interface BOOK_NOTE_ITEM {
    value : string
}

export const BookNoteItem = ({ value } : BOOK_NOTE_ITEM) => {
    return (
        <li className='font-bold'>
            <p className='mb-[10px] text-[0.7rem]'>2026.04.04 03:44 등록</p>
            <TextareaAutosize disabled={true} className="order-last w-full min-h-[50px] p-[15px]" defaultValue={value} />
            <ul className="flex justify-end gap-[10px]">
                <li><button><NotebookPen/></button></li>
                <li><button><Trash2/></button></li>
            </ul>
        </li>
    )
}