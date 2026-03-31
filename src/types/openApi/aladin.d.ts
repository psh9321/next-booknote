declare global {
    namespace ALADIN {

        /** 도서 아이템 타입 */
        interface BOOK_ITEM {
            /** 도서 제목 */
            title: string;

            /** 알라딘 상품 상세 페이지 URL */
            link: string;

            /** 저자 */
            author: string;

            /** 출판일 (YYYY-MM-DD 문자열) */
            pubDate: string;

            /** 도서 설명 */
            description: string;

            /** ISBN 10 */
            isbn: string;

            /** ISBN 13 (권장 키) */
            isbn13: string;

            /** 알라딘 내부 상품 ID */
            itemId: number;

            /** 판매가 (할인 적용가) */
            priceSales: number;

            /** 정가 */
            priceStandard: number;

            /** 상품 타입 (BOOK, MUSIC 등) */
            mallType: string;

            /** 재고 상태 */
            stockStatus: string;

            /** 적립금 */
            mileage: number;

            /** 표지 이미지 URL */
            cover: string;

            /** 카테고리 ID */
            categoryId: number;

            /** 카테고리 이름 */
            categoryName: string;

            /** 출판사 */
            publisher: string;

            /** 판매 지수 */
            salesPoint: number;

            /** 성인 도서 여부 */
            adult: boolean;

            /** 정가제 여부 */
            fixedPrice: boolean;

            /** 리뷰 평점 (0~10) */
            customerReviewRank: number;

            /** 베스트셀러 순위 (베스트셀러 API 전용) */
            bestRank?: number;

            /** 추가 정보 */
            subInfo?: ALADIN_SUB_INFO;

            /** 베스트셀러 순위 관련 추가 정보 */
            bestDuration : string;
        }

        /** 추가 정보 */
        interface ALADIN_SUB_INFO {
            /** 부제 */
            subTitle?: string;

            /** 원제 */
            originalTitle?: string;

            /** 페이지 수 */
            itemPage?: number;

            /** 책 가로 크기 */
            sizeWidth?: number;

            /** 책 세로 크기 */
            sizeHeight?: number;

            /** 목차 (HTML 문자열) */
            toc?: string;

            /** 평점 정보 */
            ratingInfo?: {
                /** 평균 평점 */
                ratingScore: number;

                /** 리뷰 개수 */
                ratingCount: number;
            };

            /** eBook 리스트 */
            ebookList?: {
                /** eBook 상품 ID */
                itemId: number;

                /** ISBN 13 */
                isbn13: string;

                /** 판매가 */
                priceSales: number;

                /** 링크 */
                link: string;
            }[];

            /** 중고 도서 정보 */
            usedList?: {
                aladinUsed: {
                    /** 알라딘 중고 수량 */
                    itemCount: number;

                    /** 최저가 */
                    minPrice: number;

                    /** 링크 */
                    link: string;
                };
                userUsed: {
                    /** 개인 판매 중고 수량 */
                    itemCount: number;

                    /** 최저가 */
                    minPrice: number;

                    /** 링크 */
                    link: string;
                };
            };
        }

        interface SEARCH_DATA {
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

        /** api 통신 실패/에러 리스폰스 */
        interface ERROR_RESPONSE {
            errorCode : number;
            errorMessage : string;
        }
    }
}

export {};
