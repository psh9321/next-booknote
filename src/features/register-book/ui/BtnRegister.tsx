"use client"

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { BookPlus, BookOpen, CheckCircle, BookMarked, Check, Trash2 } from 'lucide-react';

import { API_REGISTER_BOOK, API_REGISTER_BOOK_DELETE, API_REGISTER_BOOK_UPDATE } from '@/entities/book/api/book';

import { useIndexedDBHook } from '@/shared/hooks/useIndexedDB';

import { Confirm } from '@/shared/ui/Confirm';
import { useRouter } from 'next/navigation';

interface BTN_ADD_BOOK {
    item : ALADIN.ALADIN_ITEM,
    status : READING_STATUS
}

export const BtnRegister = ({ item, status } : BTN_ADD_BOOK) => {

    const [ isMenu, SetIsMenu ] = useState(false);

    const [ isDelete, SetIsDelete ] = useState(false);

    const { status : isLogin, data : session ,update } = useSession();

    const router = useRouter();

    const [currentStatus, SetCurrentStatus] = useState<READING_STATUS | "">(status??"");

    const { BookAdd, GetTargetBookStatus, BookUpdate, AfterLoginBookDelete, BeforeLoginBookDelete } = useIndexedDBHook();

    function GetBookItemModel(type : READING_STATUS) : Partial<BOOK_MODEL> {
        return {
            bookTitle : item["title"],
            bookCover : item["cover"],
            bookAuthor : item["author"],
            bookPublisher : item["publisher"],
            bookCategory : item["categoryName"],
            bookCode : item["isbn"],
            totalPage : item["subInfo"]?.["itemPage"]??-1,
            status : type,
        };
    }

    async function RegisterCallback(e : React.UIEvent<HTMLButtonElement>) {
        const self = e.currentTarget;

        const type  = self.dataset.readType as READING_STATUS;

        const params = GetBookItemModel(type);

        /** 등록한 상태 */
        if(currentStatus) {

            await BookUpdate(params, type, session?.user.id);

            /** 로그인 */
            if(isLogin === "authenticated") await API_REGISTER_BOOK_UPDATE(item["isbn"], type );
        }
        else {
            params["createAt"] = new Date();
            await BookAdd(params, item["title"], session?.user.id);

            /** 로그인 */
            if(isLogin === "authenticated") {
                await API_REGISTER_BOOK(params);

                update({
                    user : {
                        book : (session?.user.book??0) + 1
                    }
                })
            }
        }   

        SetIsMenu(false);
        SetCurrentStatus(type);
    }

    async function RegisterDeleteCallback() {

        if(isLogin === "authenticated") {
            
            await API_REGISTER_BOOK_DELETE(item["isbn"]);
            await AfterLoginBookDelete(item["title"], session?.user.id);

            const newBookLength = (session?.user.book??0) - 1;

            SetIsDelete(false);

            update({
                user : {
                    book : newBookLength < 0 ? 0 : newBookLength 
                }
            });

            router.refresh();
                        
        }
        else {
            await BeforeLoginBookDelete(item["title"])
        }

        SetIsMenu(false);
        SetCurrentStatus("");
    }

    useEffect(() => {
        if(isLogin === "unauthenticated") {
            GetTargetBookStatus(item["title"])
            .then(SetCurrentStatus)
        }
    },[])

    return (
        <>
        {
            isDelete && <Confirm title='도서를 삭제하시겠습니까?' contents={`${isLogin === "authenticated" ? "작성된 독서노트는 영구삭제됩니다." : "브라우저에서만 삭제됩니다."}`} submitCallback={RegisterDeleteCallback} submitBtnTxt='삭제' cancelCallback={() => SetIsDelete(false)}/>
        }
            <div className="relative inline-flex text-[1.1rem] [&>button]:h-[35px] [&>button]:leading-[35px] [@media(max-width:499px)]:justify-center">
                {
                    currentStatus ?
                    <button onClick={() => SetIsMenu(true)} className='flex justify-center items-center gap-[5px] w-[150px] bg-[#3b82f6] rounded-[10px] [&>svg]:size-[18px]'>
                        { currentStatus === "READ" && <>읽는중 <BookOpen/></> }
                        { currentStatus === "WISH" && <>읽고 싶은 책 <BookMarked/></> }
                        { currentStatus === "COMPLETED" && <>완독 <CheckCircle/></> }
                    </button>
                    :
                    <>
                        <button data-read-type="WISH" onClick={RegisterCallback} className="w-[78px] px-[8px] bg-[#3b82f6] rounded-[10px_0_0_10px]">읽고싶은</button>
                        <button onClick={() => SetIsMenu(true)} className="px-[6px] bg-[#3b82f6] border-l border-[#fff]  rounded-[0_10px_10px_0]"><BookPlus size={20} /></button>
                    </>
                }
                {
                    isMenu &&
                    <>
                        <article className="absolute top-[55px] left-[62px] w-[150px] py-[10px_5px] bg-[#1A1F22] rounded-[10px] z-2 [&>button]:flex [&>button]:items-center [&>button]:w-full [&>button]:p-[10px_10px] [&>button]:text-[1.1rem] [&>button>svg:first-child]:mr-[10px] [&>button>svg:last-child]:hidden [&>button>svg:last-child]:size-[22px] [&>button>svg:last-child]:ml-auto [&>button>svg:last-child]:stroke-[#3b82f6] [&>button.active>svg:last-child]:block [&>button.active>span]:border-b [&>button.active>span]:border-[#3b82f6] [&>button.active]:pointer-events-none before:content-[''] before:absolute before:top-[-15px] before:left-[10px] before:w-0 before:h-0 before:border-l-[20px] before:border-r-[20px] before:border-b-[20px] before:border-l-transparent before:border-r-transparent before:border-b-[#1A1F22]">
                            <h2 className="sr-only">읽기 상태 셀렉트 박스</h2>
                            <button className={`${currentStatus === "WISH" && "active"}`} onClick={RegisterCallback} data-read-type="WISH" ><BookMarked/><span>읽고싶은</span> <Check/></button>
                            <button className={`${currentStatus === "READ" && "active"}`} onClick={RegisterCallback} data-read-type="READ"><BookOpen/><span>읽는 중</span> <Check/></button>
                            <button className={`${currentStatus === "COMPLETED" && "active"}`} onClick={RegisterCallback} data-read-type="COMPLETED"><CheckCircle/><span>완독</span> <Check/></button>
                            {
                                currentStatus && <button onClick={() => SetIsDelete(true)} className='text-[#f00]'><Trash2/> <span>삭제</span></button>
                            }
                        </article>
                        <div onClick={()=> SetIsMenu(false)} className="fixed top-0 left-0 block w-full h-full z-1"></div>
                    </>
                }
            </div>        
        </>

    )
}
