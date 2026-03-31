declare global {
    namespace LIBRARY {

        interface API_SEARCH_BOOK_RESPONSE {
            /** 검색 전체 수 */
            total : number,

            /** 현재 페이지 */
            offset : number,

            /** 쪽당출력건수 (기본10건) */
            limit : number,

            /** 검색 결과 게시물 */
            items : LIBRARY_ITEM[]
        }

        interface LIBRARY_ITEM {
            /** 표제 리스트 */
            title_info: string;
            /** 자료유형 */
            type_name: string;
            /** 자료있는곳명칭(본관) */
            place_info: string;
            /** 저작자 */
            author_info: string;
            /** 발행자 */
            pub_info: string;
            /** 메뉴명 */
            menu_name: string;
            /** 매체구분 */
            media_name: string;
            /** 자료있는곳 명 */
            manage_name: string;
            /** 발행년도사항 */
            pub_year_info: string;
            /** 제어번호 */
            control_no: string;
            /** Y[원문있음] , N[원문없음]	원문유무 */
            doc_yn: string;
            /** 원문링크 */
            org_link: string;
            /** 종키 */
            id: string;
            /** 자료유형코드 */
            type_code: string;
            /** 저작권유무 */
            lic_yn: string;
            /** 저작권설명 */
            lic_text: string;
            /** 비치일 */
            reg_date: string;
            /** 상세페이지경로 */
            detail_link: string;
            /** ISBN */
            isbn: string;
            /** 청구기호 */
            call_no: string;
            /** 동양서분류기호 대분류 코드 */
            kdc_code_1s: string;
            /** 동양서분류기호 대분류 명칭 */
            kdc_name_1s: string;
        }

        type 시스템오류 = ERROR_RESPONSE<"000", "SYSTEM ERROR:SYSTEM 오류">
        type 인증키값누락 = ERROR_RESPONSE<"010", "NO KEY VALUE:인증키값 누락">
        type 유효하지않은인증키 = ERROR_RESPONSE<"011", "INVALID KEY:유효하지않은 인증키">
        type 검색결과이동시500건제한 = ERROR_RESPONSE<"012", "DATA LIMIT 500:검색결과 이동시 500건 제한(500건 이후 데이터 조회불가)">
        type 카테고리값입력오류 = ERROR_RESPONSE<"013", "CATEGORY ERROR:카테고리값 입력오류">
        type 파라메터입력값오류 = ERROR_RESPONSE<"014", "PARAMETER VALIDATION ERROR:파라메터 입력값 오류">
        type 파라메터입력오류 = ERROR_RESPONSE<"015", "REQUIRED PARAMETER MISSING:필수 파라메터 입력 오류(검색어 or 상세검색)">
        type 검색서버오류 = ERROR_RESPONSE<"101", "SEARCH ERROR:검색서버 오류">

        type API_ERROR_RESPONSE = 시스템오류 | 인증키값누락 | 유효하지않은인증키 | 검색결과이동시500건제한 | 카테고리값입력오류 | 파라메터입력값오류 | 파라메터입력오류 | 검색서버오류
    }
}

export {}