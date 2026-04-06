"use server";

import { ConnectDB } from "@/shared/lib/connectDB";

import { BookModel } from "@/entities/book/model/book.schema";
import { BookNoteModel } from "@/entities/book-note/model/booknote.schema";

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
