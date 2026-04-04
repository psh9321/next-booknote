"use client"

import Link from "next/link";
import Image from "next/image";

import { useLatestAddBookHook } from "@/hooks/useQuery";
import { EmptyItem } from "@/shared/ui/EmptyItem";

export const LatestReadBookList = () => {

    const { data, isError } = useLatestAddBookHook();

    // const { GetLatestWishBook } = useIndexedDBHook();

    // useEffect(() => {

    //     if(session.status === "unauthenticated") {
    //         if(window) {
    //             GetLatestWishBook().then(SetData)
    //         }
    //     }
    //     else {
    //         SetData(wishBookData?.["pages"]?.[0]?.["list"].slice(0,2));
    //     }

    // },[session.status]);

    if(isError) return <></>

    return (
        <ul className="space-y-[20px]">
            {
                data.length > 0 ?
                (data as BOOK_MODEL[])?.map((el, i) => {
                    return <li key={`인기도서-${el["bookTitle"]}-${i}`}>
                   <Link className="inline-flex justify-between" href={`/book/${el["bookCode"]}`}>
                            <div className="relative w-[120px] h-[150px]">
                                <Image fill sizes="auto" src={el?.["bookCover"]!} alt={`${el["bookTitle"]} 커버 이미지`} loading="eager" className="object-contain rounded-[10px]"/>
                            </div>
                            <dl className="w-[calc(100%-120px)] mt-[12px] ml-[12px] [&>dd]:leading-[1.8] [&>dd]:text-[0.8rem] [&>dd]:truncate">
                                <dt className="mb-[15px] line-clamp-2">{el["bookTitle"]}</dt>
                                <dd>{el["bookAuthor"]}</dd>
                                <dd>{el["bookPublisher"]}</dd>
                            </dl>
                        </Link>
                    </li>
                })
                : 
                <li className="text-center font-bold">
                    <EmptyItem title="책을 등록한 유저가 없습니다." txt="처음으로 책을 등록해보세요." anchorTxt="등록할 책 찾기"/>
                </li>
            }
        </ul>
    )
}