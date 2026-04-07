"use client"

import Image from "next/image";

import { useSession } from "next-auth/react";

import { useEffect, useState } from "react";

import { BookPlus, BookMinus, Square, SquareCheckBig, BookCheck, X, CloudSync } from 'lucide-react';

import { useIndexedDBHook } from "@/shared/hooks/useIndexedDB";

import { API_SYNC_BOOK } from "./api/sync";

import { Portal } from "@/shared/ui/Portal";

interface SYNC_LIST {
    status : READING_STATUS,
    cancelCallback : () => void
}

export const SyncList = ({ status, cancelCallback } : SYNC_LIST) => {

    const { GetBookList, SyncBookData } = useIndexedDBHook();

    const { data : session } = useSession();

    const [ localData, SetLocalData ] = useState<(Partial<BOOK_MODEL> & {sync : string[]})[]>([]);

    const [ checkedItems, SetCheckedItems ] = useState<Map<string, boolean>>(new Map());

    const statusText = (() => {
        switch (status) {
            case "COMPLETED": return "완독 도서";
            case "READ": return "읽고있는 도서"
            case "WISH": return "읽고싶은 도서"
            default: return ""
        }
    })();

    async function SyncCallback() {

        const syncTargetTitle = [...checkedItems].filter(([_, is]) => is).map(el => el[0]);

        if(syncTargetTitle.length <= 0) return

        const validata = localData.filter(el => syncTargetTitle.includes(el["bookTitle"] as string));

        await API_SYNC_BOOK(validata);

        await SyncBookData(syncTargetTitle, session?.user.id!, status);

        cancelCallback()
    }

    useEffect(() => {
        GetBookList(status)
        .then((rs) => {
            rs.filter(el => !el["sync"].includes(session?.user.id as string)).forEach(el => {
                SetCheckedItems(prev => prev.set(el["bookTitle"], false));
            });

            SetLocalData(rs);
        })
    },[])

    return (
        <Portal>
            <div className="fixed top-[0] left-[0] top-0 left-0 flex justify-center items-center w-full h-full bg-[rgba(0,0,0,0.8)] z-[999]">
                <section className="relative flex flex-wrap justify-between items-start w-[500px] max-h-[450px] p-[0_20px_20px_20px] overflow-y-auto bg-[#2A2F32] rounded-[10px]">
                    <div className="sticky top-[0] flex justify-between items-center w-full h-[40px] py-[20px] bg-[#2A2F32] z-[2]">
                        <h3>{statusText} 동기화목록</h3>
                        <button onClick={() => cancelCallback?.()}><X size={30}/></button>
                    </div>
                    <div className="sticky top-[70px] mt-[20px] z-[2] [@media(max-width:550px)]:top-[40px] [@media(max-width:550px)]:w-full [@media(max-width:550px)]:py-[10px] [@media(max-width:550px)]:text-center [@media(max-width:550px)]:bg-[#2A2F32] ">
                        <label className="flex flex-wrap items-center text-[0.9rem] [@media(max-width:550px)]:justify-center" htmlFor={`${status}-add-all-check`}>
                            <span className="underline mr-[5px]">전체 선택</span>
                            {
                                checkedItems.values().every(el => el) ? <SquareCheckBig size={16} /> : <Square size={16}/>
                            }
                            <span className="block w-full text-[0.8rem]">총 ({checkedItems.size})</span>
                            
                        </label> 
                        <input onChange={(e) => {
                            const checked = e.currentTarget.checked
                            SetCheckedItems(prev => new Map([...prev.keys()].map(k => [k, checked])));
                        }} type="checkbox" hidden id={`${status}-add-all-check`} /> 
                        <button onClick={SyncCallback} className="inline-flex items-center gap-[5px] mt-[30px] p-[5px_10px] text-[1.1rem] bg-[#3b82f6] rounded-[10px]">
                            동기화 <CloudSync size={22}/>
                        </button>
                    </div>
                    <ul className={"inline-flex flex-wrap gap-[10px] w-[320px] mt-[30px] select-none [@media(max-width:550px)]:mx-auto"}>
                        {
                            localData.length > 0 ?
                            localData.map((el, i) => {
                                return (
                                    <li className="relative" key={`로컬데이터-${el["bookTitle"]}-${i}`}>
                                        {
                                            el["sync"].includes(session?.user.id as string)
                                            &&
                                            <div className="absolute top-[0] left-[0] flex justify-center items-center w-full h-full bg-[rgba(0,0,0,0.6)] z-2">
                                                <span className="py-[5px] px-[10px] bg-[#2A2F32] rounded-[10px]">동기화 완료</span>
                                            </div> 
                                        }

                                        <label className="flex cursor-pointer" htmlFor={`${status}-add-check-${i}`}>
                                            
                                            {
                                                el["sync"].includes(session?.user.id as string) ? 
                                                <BookCheck/> :
                                                checkedItems.get(el["bookTitle"] as string) ? <BookMinus/> : <BookPlus/>
                                            }
                                            <Image width={100} height={180} sizes="auto" src={el["bookCover"] as string} alt={`${el["bookTitle"]} 커버 이미지`} loading="eager" className="inline-block object-contain"/>
                                        </label>
                                        <input
                                            type="checkbox"
                                            hidden
                                            id={`${status}-add-check-${i}`}
                                            checked={checkedItems.get(el["bookTitle"] as string) ? true : false}
                                            onChange={() => SetCheckedItems(prev => new Map(prev).set(el["bookTitle"] as string, !prev.get(el["bookTitle"] as string)))}
                                        />                  
                                    </li>
                                )
                            })
                            : 
                            <li>로그인전 등록한 {statusText} 가 없습니다.</li>
                        }
                    </ul>                    
                </section>
            </div>
        </Portal>
    )
}