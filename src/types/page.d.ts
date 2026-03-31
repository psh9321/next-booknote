declare global {
    type SEARCH_PARAMS_TYPE = "book" | "bookclub" | "user";
    
    interface SEARCH_PARAMS_ITEM {
        type : SEARCH_PARAMS_TYPE
    }

    interface SEARCH_PAGE_PARAMS {
        params : Promise<SEARCH_PARAMS_ITEM>;
    }

    interface BOOK_INFO_PAGE_PARAMS {
        params : Promise<{bookcode : string}>
    }
}

export {}