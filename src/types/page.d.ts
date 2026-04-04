declare global {
    interface BOOK_INFO_PAGE_PARAMS {
        params : Promise<{bookcode : string}>
    }

    interface MY_PAGE_PARAMS {
        params : Promise<{status : "read" | "completed" | "wish"}>
    }
}

export {}