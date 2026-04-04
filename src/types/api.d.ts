declare global {

    namespace ALADIN_API {
        interface LIST_RESPONSE {
            /** API 버전 */
            version: string;

            /** 요청 결과 제목 (ex: 베스트셀러) */
            title: string;

            /** 해당 리스트 URL */
            link: string;

            /** 응답 생성 시간 (문자열 Date) */
            pubDate: string;

            /** 전체 결과 개수 */
            totalResults: number;

            /** 시작 인덱스 */
            startIndex: number;

            /** 페이지당 아이템 수 */
            itemsPerPage: number;

            /** 요청 쿼리 */
            query: string;

            /** 카테고리 ID */
            searchCategoryId: number;

            /** 카테고리 이름 */
            searchCategoryName: string;

            /** 도서 리스트 */
            item: ALADIN.ALADIN_ITEM[];
        }  
        
        /** api 통신 실패/에러 리스폰스 */
        interface ERROR_RESPONSE {
            errorCode : number;
            errorMessage : string;
        }
    }

    namespace CLIENT_API {

        interface RESPONSE_MODEL<T> {
            resultCode: number; /** number */
            data: T | null; /** object | string | null */
            errMsg: string; /** string */
        }

        /** 리스트 데이터 타입 */
        interface INFINITY_RESPONSE_ITEM<T> {
            /** 현재 페이지 */
            page : number;

            limit : number;

            /** 전체 게시물 수 */
            total : number;

            list : T
        }

        interface SEARCH_PARAMS {
            /** 검색어 */
            keyword : string,

            /** 시작페이지 */
            offset : number,

            /** 게시물 수 */
            limit : number
        }

        interface SEARCH_ITEM {
            bookTitle : string,
            bookCover : string,
            bookAuther : string,
            bookPublisher : string,
            bookCode : string
        }

        interface SEARCH_RESPONSE_DATA extends INFINITY_RESPONSE_ITEM<SEARCH_ITEM[]> {
            keyword : string
        }

        type SEARCH_RESPONSE = RESPONSE_MODEL<SEARCH_RESPONSE_DATA>;

        type BOOK_ITEM_LIST_RESPONSE = INFINITY_RESPONSE_ITEM<BOOK_MODEL[]>

        type ERROR_RESPONSE = RESPONSE_MODEL<Error>
    }
}

export {}