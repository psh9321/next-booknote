import type { InferSchemaType, HydratedDocument } from "mongoose";

import { BookSchema } from "@/entities/book/model/book.schema"

import { BookNoteSchema } from "@/entities/book-note/model/booknote.schema"

declare global {
    type BOOK_MODEL = HydratedDocument<InferSchemaType<typeof BookSchema>>;

    type BOOK_NOTE_MODEL = HydratedDocument<InferSchemaType<typeof BookNoteSchema>>;

    /** 
     * 읽기 상태 
     * READ : 읽는중
     * WISH : 읽고싶은 책
     * COMPLETED : 완독
     * STOPPED : 읽기 중단
     * */
    type READING_STATUS = "READ" | "WISH" | "COMPLETED"
}

export {}