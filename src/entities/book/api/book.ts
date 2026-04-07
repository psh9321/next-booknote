"use server";

import { ConnectDB } from "@/shared/lib/connectDB";
import { GetSessionId } from "@/shared/lib/getSessionId";

import { BookModel } from "../model/book.schema";
import { BookNoteModel } from "@/entities/book-note/model/booknote.schema";

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

export async function API_REGISTER_BOOK(item: Partial<BOOK_MODEL>) {
    try {
        const userId = await GetSessionId();

        if (!userId) throw new Error("로그인이 필요합니다.");

        await ConnectDB(async () => BookModel.create({ ...item, userId }));

        revalidatePath("/");
        revalidatePath("/book/[bookcode]", "page");
        revalidatePath("/my/[status]");
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

        await ConnectDB(async () => Promise.all([
            BookModel.deleteOne({ userId, bookCode }),
            BookNoteModel.deleteMany({ userId, bookCode })
        ]));
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

export async function API_GET_MY_BOOK(userId: string, offset: number, status : READING_STATUS, limit = 20) {
    try {
        const params = { userId, status };

        const [total, list] = await ConnectDB(async () => Promise.all([
            BookModel.countDocuments(params),
            BookModel.find(params)
            .sort({ createAt: -1 })
            .skip(Number(offset) * Number(limit))
            .limit(Number(limit))
        ]));


        return JSON.parse(JSON.stringify({ total, page : offset, limit, list }));

    }
    catch (err) {
        console.log(err);
        throw err;
    }
}
