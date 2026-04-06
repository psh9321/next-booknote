"use server";

import { ConnectDB } from "../util/connectDB";

import { BookModel } from "@/schema/book.schema";
import { BookNoteModel } from "@/schema/booknote.schema";

export async function API_USER_INFO(userId : string) {
    try {

        const params = { userId };

        const [book, booknote] = await ConnectDB(async () => Promise.all([
            BookModel.countDocuments(params),
            BookNoteModel.countDocuments(params),
        ]));

        return { book, booknote }
    }
    catch(err) { 
        console.log(err);
        throw err;
    }
}