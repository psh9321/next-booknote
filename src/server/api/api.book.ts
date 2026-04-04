"use server";

import { ConnectDB } from "../util/connectDB";
import { GetSessionId } from "../util/getSessionId";

import { BookModel } from "../../schema/book.schema";
import { revalidatePath } from "next/cache";

export async function API_GET_LATEST_ADD_BOOK() {
    try {
        const result = await ConnectDB(async () => {
            return await BookModel.find().sort({ createAt: -1 }).limit(3);
        });

        return JSON.parse(JSON.stringify(result));
    } 
    catch (err) {
        console.log(err);
        throw err;
    }
}

export async function API_REGISTER_BOOK(item: BOOK_MODEL) {
    try {
        const userId = await GetSessionId();

        if (!userId) throw new Error("로그인이 필요합니다.");

        await ConnectDB(async () => BookModel.create({ ...item, userId }));

        revalidatePath("/");
        revalidatePath("/book/[bookcode]", "page");
    } 
    catch (err) {
        console.log(err);
        throw err;
    }
}

export async function API_REGISTER_BOOK_UPDATE(
    bookCode: string,
    status: READING_STATUS,
) {
    try {
        const userId = await GetSessionId();

        if (!userId) throw new Error("로그인이 필요합니다.");

        await ConnectDB(async () => {
            await BookModel.updateOne(
                { userId, bookCode },
                {
                    $set: {
                        status,
                        updateAt: (() => {
                            const now = new Date();
                            return new Date(
                                now.getTime() - now.getTimezoneOffset() * 60000,
                            );
                        })(),
                    },
                },
            );
        });
    } 
    catch (err) {
        console.log(err);
        throw err;
    }
}

export async function API_REGISTER_BOOK_DELETE(bookCode: string) {
    try {
        const userId = await GetSessionId();

        if (!userId) throw new Error("로그인이 필요합니다.");

        await ConnectDB(async () => {
            await BookModel.deleteOne({ userId, bookCode });
        });
    } 
    catch (err) {
        console.log(err);
        throw err;
    }
}

/** 등록한 책인지 확인 */
export async function API_CHECK_REGISTER_BOOK(
    userId: string,
    bookCode: string,
) {
    try {
        const result = await ConnectDB(async () =>
            BookModel.findOne({ userId, bookCode }),
        );

        return result?.["status"] ?? "";
    } 
    catch (err) {
        console.log(err);
        throw err;
    }
}

export async function API_GET_MY_BOOK(userId: string, offset: number, status : READING_STATUS, limit = 15) {
    try {
        const params = { userId, status };

        const [total, list] = await ConnectDB(async () => Promise.all([
            BookModel.countDocuments(params),
            BookModel.find(params)
            .skip(Number(offset) * Number(limit))
            .limit(Number(limit)),
        ]));

        
        return JSON.parse(JSON.stringify({ total, page : offset, limit, list }));

    } 
    catch (err) {
        console.log(err);
        throw err;
    }
}
