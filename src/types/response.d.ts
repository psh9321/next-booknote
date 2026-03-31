declare global {

    interface RESPONSE_MODEL<T> {
        resultCode: number; /** number */
        data: T | null; /** object | string | null */
        errMsg: string; /** string */
    }

    /** 베스트셀러 리스폰스 */
    type API_BEST_SELLER_LIST = RESPONSE_MODEL<ALADIN.BOOK_ITEM[] | ALADIN.ERROR_RESPONSE | Error | null>;

    /** 인기있는 독서노트 리스폰스 */
    type API_SERVER_GET_POPULAR_BOOK_NOTE = RESPONSE_MODEL<BOOK_NOTE_ITEM[] | null | Error>

    /** 인기있는 도서 리스폰스 */
    type API_SERVER_GET_POPULAR_BOOK = RESPONSE_MODEL<BOOK_ITEM[] | null | Error>

    interface SEARCH_BOOK_DATA {
        /** 전체 검색 데이터 수 */
        total : number,

        /** 현재 페이지 */
        page : number,

        /** 쪽당출력건수 (기본10건) */
        limit : number,

        /** 검색어 */
        keyword : string,

        /** 검색 결과 게시물 */
        items : BOOK_ITEM[]
    }

    /** 도서 검색 리스폰스 */
    type API_GET_SEARCH_BOOK = RESPONSE_MODEL<SEARCH_BOOK_DATA>

    /** 도서 상세 페이지 */
    type API_TARGET_BOOK_INFO = RESPONSE_MODEL<ALADIN.BOOK_ITEM>

    /** 내 유틸 정보 */
    type API_MY_UTIL_INFO = RESPONSE_MODEL<MY_UTIL_INFO>

    interface MY_BOOK_ITEM {
        /** 책 제목 */
        bookTitle : string;

        /** 책 내용 */
        bookContents : string;

        /** 책 커버 */
        bookCover : string;

        /** 책 시리얼 넘버 */
        bookCode : string;

        /** 작가 */
        bookAuther : string;

        /** 출판사 */
        bookPublisher : string;

        /** 등록한 유저 아이디 */
        userId : string;

        /** 등록한 유저 이름 */
        userName : string;

        /** 등록한 날짜 */
        addDate : string;
    }

    interface MY_BOOK_RESPONSE {
        /** 현재 페이지 */
        page : number;

        limit : number;

        /** 전체 게시물 수 */
        total : number;

        /** 저장된 책 리스트 */
        list : MY_BOOK_ITEM[]
    }

    type API_GET_MY_BOOK = RESPONSE_MODEL<MY_BOOK_RESPONSE>
}

export {}