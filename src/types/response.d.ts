declare global {

    interface RESPONSE_MODEL<T> {
        resultCode: number; /** number */
        data: T | null; /** object | string | null */
        errMsg: string; /** string */
    }

    interface INFINITY_RESPONSE_ITEM<T> {
        /** 현재 페이지 */
        page : number;

        limit : number;

        /** 전체 게시물 수 */
        total : number;

        list : T
    }

    /** 베스트셀러 리스폰스 */
    type API_BEST_SELLER_LIST = RESPONSE_MODEL<ALADIN.BOOK_ITEM[] | ALADIN.ERROR_RESPONSE | Error | null>;

    /** 인기있는 독서노트 리스폰스 */
    type API_SERVER_GET_POPULAR_BOOK_NOTE = RESPONSE_MODEL<BOOK_NOTE_ITEM[] | null | Error>

    /** 인기있는 도서 리스폰스 */
    type API_SERVER_GET_POPULAR_BOOK = RESPONSE_MODEL<BOOK_ITEM[] | null | Error>

    interface SEARCH_BOOK_DATA extends INFINITY_RESPONSE_ITEM<BOOK_ITEM[]> {
        /** 검색어 */
        keyword : string,
    }

    /** 도서 검색 리스폰스 */
    type API_GET_SEARCH_BOOK = RESPONSE_MODEL<SEARCH_BOOK_DATA>

    /** 도서 상세 페이지 */
    type API_TARGET_BOOK_INFO = RESPONSE_MODEL<ALADIN.BOOK_ITEM>

    /** 내 유틸 정보 */
    type API_MY_UTIL_INFO = RESPONSE_MODEL<MCY_INFO_ITEM>

    type MY_BOOK_RESPONSE = INFINITY_RESPONSE_ITEM<MY_BOOK_ITEM[]>;

    type API_GET_MY_BOOK = RESPONSE_MODEL<INFINITY_RESPONSE_ITEM<MY_BOOK_ITEM[]>>

    type MY_BOOK_NOTE_RESPONSE = INFINITY_RESPONSE_ITEM<MY_BOOK_NOTE_ITEM[]>

    type API_GET_MY_BOOK_NOTE = RESPONSE_MODEL<MY_BOOK_NOTE_RESPONSE>

    type MY_SCRAP_BOOK_NOTE = INFINITY_RESPONSE_ITEM<MY_SCRAP_BOOK_NOTE_ITEM[]>

    type API_GET_MY_SCRAP_BOOK_NOTE_LIST = RESPONSE_MODEL<MY_SCRAP_BOOK_NOTE>
}

export {}