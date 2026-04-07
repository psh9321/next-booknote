"use server"

import type { InferSchemaType } from "mongoose";

import { ConnectDB } from "@/shared/lib/connectDB";

import { BookModel } from "@/entities/book/model/book.schema";
import { BookNoteModel, BookNoteSchema } from "../model/booknote.schema";

type BookNoteInput = InferSchemaType<typeof BookNoteSchema>;

export async function API_LATEST_BOOK_NOTE(userId : string): Promise<BOOK_NOTE_MODEL[]> {
    try {
        const result = await ConnectDB(async () => BookNoteModel.find({ userId }).sort({ createAt: -1 }).limit(5));

        return JSON.parse(JSON.stringify(result));
    }
    catch(err) {
        console.log(err);
        throw err;
    }
}

export async function API_GET_MY_BOOK_NOTE(userId : string, bookCode : string, offset : number, limit = 20) {
    try {

        const params = { userId, bookCode };

        const [total, list] = await ConnectDB(async () => Promise.all([
            BookNoteModel.countDocuments(params),
            BookNoteModel.find(params)
            .sort({ createAt: -1 })
            .skip(Number(offset) * Number(limit))
            .limit(5)
        ]));

        return JSON.parse(JSON.stringify({ total, page : offset, limit, list }));
    }
    catch(err) {
        console.log(err);
        throw err;
    }
}

export async function API_UPDATE_MY_BOOK_NOTE(userId : string, _id : string, noteContents : string) {
    try {

        await ConnectDB(async () => {
            await BookNoteModel.updateOne(
                {userId, _id},
                {
                    $set : {
                        noteContents,
                        updateAt: (() => {
                            const now = new Date();
                            return new Date(
                                now.getTime() - now.getTimezoneOffset() * 60000,
                            );
                        })(),
                    }
                }
            )
        })
    }
    catch(err) {
        console.log(err);
        throw err;
    }
}

export async function API_DELETE_MY_BOOK_NOTE(userId : string, _id : string) {
    try {
        await ConnectDB(async () => BookNoteModel.deleteOne({userId, _id})   )
    }
    catch(err) {
        console.log(err);
        throw err;
    }
}

export async function API_ADD_MY_BOOK_NOTE(params : Partial<BookNoteInput>) {
    try {
      return await ConnectDB(async () => {

        const bookInfo = await BookModel.findOne({ userId : params["userId"], bookCode : params["bookCode"] });

        if(!bookInfo) return 403

        await BookNoteModel.create({...params})

        return 200

      })
    }
    catch(err) {
        console.log(err);
        throw err;
    }
}
