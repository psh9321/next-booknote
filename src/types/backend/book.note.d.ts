declare global {
    /** 스크랩 게시물 아이템 */
    interface BOOK_NOTE_ITEM {
        /** 고유 아이디 (ex. S3A9F1B2) */
        _id: string;

        /** 독서노트 제목 */
        noteTitle : string;

        /** 콘텐츠내용 */
        noteContents : string;

        /** 책 제목 */
        bookTitle : string;

        /** 책 커버 이미지 */
        bookCover : string;

        /** 작성자 아이디 */
        writerId: string;

        /** 작성자 이름 */
        writerName: string;

        /** 콘텐츠 이미지 */
        contentsImages: string[];

        /** 좋아요 (user id 배열) */
        favorite: string[];

        /** 공개 여부 */
        isPublic: boolean;

        /** 생성일 */
        createDate: string;

        /** 수정일 */
        updateDate: string;

        /** 독서노트 좋아요 수 */
        favorite : number;

        /** 독서노트 스크랩 수 */
        scrap : number
    }
}

export {};
