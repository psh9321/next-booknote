import mongoose from "mongoose";

export const BookNoteSchema = new mongoose.Schema({
    /** 책 제목 */
    bookTitle: String,

    /** 책 커버 */
    bookCover: String,

    /** 북코드 */
    bookCode: String,

    /** 책 등록 유저 아이디 */
    userId: String,

    /** 독서노트 */
    noteContents : String,

    /** 독서노트 생성 일 */
    createAt : {
        type : Date,
        default : () => {
            const now = new Date();
            return new Date(now.getTime() - now.getTimezoneOffset() * 60000);
        }
    },

    /** 독서노트 수정 일 */
    updateAt : {
        type : Date,
        default : null
    },
});

export const BookNoteModel = mongoose.models.booknote ?? mongoose.model("booknote", BookNoteSchema, "booknote");
