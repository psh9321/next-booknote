declare global {
    interface BOOK_ITEM {
        /** 고유 아이디 (ex. S3A9F1B2) */
        _id: string;

        /** 책 제목 */
        bookTitle : string;

        /** 책 내용 */
        bookContents : string;

        /** 책 커버 이미지 */
        bookCover : string;

        /** isbn */
        bookCode : string;

        /** 책 작가 */
        bookAuther : string;

        /** 책 출판사 */
        bookPublisher : string;

        /** 등록한 유저 아이디 */
        userId: string;

        /** 등록한 유저 이름 */
        userNickName : string;

        /** 책 등록일 */
        addDate : string;
    }
}

export {}