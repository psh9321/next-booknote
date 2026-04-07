"use server"

import { ConnectDB } from "@/shared/lib/connectDB";
import { GetSessionId } from "@/shared/lib/getSessionId";

import { BookModel } from "@/entities/book/model/book.schema";
import { API_REGISTER_BOOK, API_REGISTER_BOOK_UPDATE } from "@/entities/book/api/book";

/** 동기화 api */
export async function API_SYNC_BOOK(books: Partial<BOOK_MODEL>[]) {
    try {
        const userId = await GetSessionId();

        if(!userId) throw new Error("로그인이 필요합니다.");   

        await ConnectDB(async () => {
            for(const item of books) {
                const bookInfo = await BookModel.findOne({userId, bookCode : item["bookCode"]});

                /** 책정보가 있을 시 */
                if(bookInfo) {
                    /** 책정보가 있지만 status 가 다를때 */
                    if(bookInfo["status"] !== item["status"]) {
                        await API_REGISTER_BOOK_UPDATE(item["bookCode"] as string, item["status"] as READING_STATUS)
                    }
                }
                /** 책정보가 없을 시 */
                else {
                    await API_REGISTER_BOOK(item);
                }
            }
        })
    }
    catch(err) {
        throw err
    }
}
