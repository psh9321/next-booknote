import { BACKEND_API } from "@/shared/util/instance";

export async function API_GET_SEARCH_BOOK(keyword : string, offset = 1, limit = 10) {
    try {
        const result = await BACKEND_API("aladin/search/book", {
            searchParams : { keyword, offset, limit }
        })
        .json<API_GET_SEARCH_BOOK>()
        .catch<API_GET_SEARCH_BOOK>()

        if(!result) throw result

        if(result["resultCode"] !== 200) return null;
        
        return result["data"];
    }
    catch(err) { 
        console.log(err);
        throw err;
    }
}