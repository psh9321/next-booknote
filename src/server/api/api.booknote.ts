"use server"

import { ConnectDB } from "../util/connectDB";

import { BookNoteModel } from "@/schema/booknote.schema";

export async function API_LATEST_BOOK_NOTE() {
    try {
        const result = await ConnectDB(async () => BookNoteModel.find().sort({ createAt: -1 }).limit(5));

        return JSON.parse(JSON.stringify(result));
    }
    catch(err) { 
        console.log(err);
        throw err;
    }
}