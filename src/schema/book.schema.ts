import mongoose from "mongoose";

export const BookSchema = new mongoose.Schema({
    /** 책 제목 */
    bookTitle: String,

    /** 책 커버 */
    bookCover: String,

    /** 북코드 */
    bookCode: String,

    /** 지은이 */
    bookAuthor: String,

    /** 출판사 */
    bookPublisher: String,

    /** 책 등록 유저 아이디 */
    userId: String,

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
        default : () => {
            const now = new Date();
            return new Date(now.getTime() - now.getTimezoneOffset() * 60000);
        }
    },

    /** 독서 상태 */
    status : String,

    /** 도서 카테고리 ex) 소설>만화 ... */
    bookCategory: String,
    
    /** 전체 페이지 수 */
    totalPage: Number
});

export const BookModel = mongoose.models.book ?? mongoose.model("book", BookSchema, "book");