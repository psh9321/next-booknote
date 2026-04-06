import { CLIENT_API } from "@/shared/util/instance";

export async function API_CLIENT_GET_SEARCH_BOOK(keyword : string, offset = 1, limit = 10) {
    try {
        const result = await CLIENT_API("book/search", {
            json : { keyword, offset, limit }
        })
        .json<CLIENT_API.SEARCH_RESPONSE>();

        if(result["resultCode"] === 500) throw result

        return result["data"]!
    }
    catch(err) {
        console.log(err);
        throw err;
    }
}
