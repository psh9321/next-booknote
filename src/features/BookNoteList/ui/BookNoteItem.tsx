"use client"

import { Trash2, NotebookPen } from 'lucide-react';
import { useRef, useState } from 'react';

import TextareaAutosize from "react-textarea-autosize";

import { Confirm } from '@/shared/ui/Confirm';

import { API_DELETE_MY_BOOK_NOTE, API_UPDATE_MY_BOOK_NOTE } from '@/server/api/api.booknote';
import { DateFormat } from '@/shared/util/dateFormat';
import { useSession } from 'next-auth/react';

interface BOOK_NOTE_ITEM {
    item : BOOK_NOTE_MODEL,
    RefetchCallback : () => void
}

export const BookNoteItem = ({ item, RefetchCallback } : BOOK_NOTE_ITEM) => {

    const { data : session ,update } = useSession();

    const [isEdit, SetIsEdit] = useState(false);

    const [ deleteId, SetDelteId ] = useState("");
 
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    function EditSubmitCallback() {
        if(!textareaRef["current"]) return 

        const textarea = textareaRef["current"];

        if(item["noteContents"] === textarea.value) return 

        API_UPDATE_MY_BOOK_NOTE(item["userId"] as string ,item["_id"].toString(), textarea.value)
        .then(() => {
            RefetchCallback?.()
        })
    }

    function CancelCallback() {
        if(!textareaRef["current"]) return 

        const textarea = textareaRef["current"];

        if(item["noteContents"] !== textarea.value) {
            if(confirm("작성한 내용은 저장되지않습니다. 수정을 취소하시겠습니까?")) {
                textarea.value = item["noteContents"] as string;
                SetIsEdit(false)
            }
        }
        else {
            SetIsEdit(false);
        }
        
    }

    function DeleteSubmitCallback() {
        API_DELETE_MY_BOOK_NOTE(item["userId"] as string, deleteId)
        .then(async () => {
            RefetchCallback?.();
            update({
                user : {
                    booknote : (session?.user.booknote ?? 0) - 1
                }
            });
        })
    }
    
    return (
        <>
            {
                deleteId && 
                <Confirm title="독서노트 삭제" contents="해당 내용을 삭제 하시겠습니까?<br/>삭제한 내용은 복구되지않습니다." submitCallback={DeleteSubmitCallback} cancelCallback={() => SetDelteId("")} />
            }

            <li className={"relative font-bold"}>
                <p className='mb-[10px] text-[0.7rem]'>
                    { item["updateAt"] ?  `${DateFormat(item["updateAt"].toString())} 수정` : `${DateFormat(item["createAt"].toString())} 등록`}
                </p>
                <TextareaAutosize ref={textareaRef} disabled={!isEdit} className={`order-last w-full min-h-[50px] p-[15px] ${ isEdit && "border rounded-[10px]" }`} defaultValue={item["noteContents"]??""} />
                <ul className="flex justify-end gap-[10px] mt-[10px]">
                    <li>
                        {
                            isEdit ?
                            <button onClick={EditSubmitCallback}>수정</button> 
                            :
                            <button onClick={() => SetIsEdit(true)}><NotebookPen/></button>
                        }
                    </li>
                    <li>
                        {
                            isEdit ? 
                            <button onClick={CancelCallback}>취소</button> 
                            :
                            <button onClick={() => SetDelteId(item["_id"].toString())}><Trash2/></button>    
                        }
                    </li>
                </ul>
            </li>
        </>
    )
}