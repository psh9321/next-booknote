"use client"

import { useSession } from "next-auth/react";
import { useRef } from "react";

import { useQueryClient } from "@tanstack/react-query";

import TextareaAutosize from "react-textarea-autosize";
import { API_ADD_MY_BOOK_NOTE } from "@/server/api/api.booknote";

interface ADD_BOOK_NOTE {
    bookcode : string
}

export const AddBookNote = ({ bookcode } : ADD_BOOK_NOTE) => {

    const { data : session, update } = useSession();

    const queryClient = useQueryClient();

    const bookInfo = queryClient.getQueryData([process.env.NEXT_PUBLIC_QUERY_KEY_BOOK_INFO, bookcode]) as ALADIN.ALADIN_ITEM;
    
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    function SubmitCallback() {

        if(!textareaRef["current"]) return

        const textarea = textareaRef["current"]

        const noteContents = textarea.value;

        if(!noteContents) return

        const item = {
            userId : session?.user.id,
            bookTitle : bookInfo?.["title"],
            bookCover : bookInfo?.["cover"],
            bookCode : bookInfo?.["isbn"],
            noteContents,
        }

        API_ADD_MY_BOOK_NOTE(item)
        .then(() => {
            queryClient.refetchQueries({queryKey : [process.env.NEXT_PUBLIC_QUERY_KEY_MY_BOOK_NOTE, item["userId"], item["bookCode"]]});
            textarea.value = "";

            update({
                user : {
                    booknote :  (session?.user.booknote ?? 0) + 1
                }
            })
        })
    }

    function ResetCallback() {
        if(!textareaRef["current"]) return
        
        textareaRef["current"].value = "";
        textareaRef["current"].focus();
    }

    return (
        <>
            <article>
                <h2 className="sr-only">독서노트 textarea</h2>
                <TextareaAutosize placeholder={`"${bookInfo["title"]}" 에 관한 \n 노트를 기록해보세요.`} ref={textareaRef} className="w-full min-h-[100px] p-[10px] border rounded-[6px] [&::placeholder]:text-[0.8rem] [&::placeholder]:break-keep"/>
                <ul className="flex justify-end gap-[10px] mt-[20px] [&>li>button]:h-[45px] [&>li>button]:px-[25px] [&>li>button]:border [&>li>button]:rounded-[8px] [@media(max-width:850px)]:mt-[10px] [@media(max-width:850px)]:[&>li>button]:h-[35px] [@media(max-width:850px)]:[&>li>button]:px-[15px]">
                    <li><button onClick={ResetCallback}>작성 초기화</button></li>
                    <li><button onClick={SubmitCallback} className="bg-[#3b82f6] border-[#3b82f6]">작성</button></li>
                </ul>
            </article>
        </>
    )
}