import { BACKEND_API } from "@/shared/util/instance";

export async function API_GET_POPULAR_BOOK() {
    try {
        const result = await BACKEND_API("book/popular").json<API_SERVER_GET_POPULAR_BOOK>()
        .catch<API_SERVER_GET_POPULAR_BOOK>()

        if(!result) throw result

        if(result["resultCode"] !== 200) return null

        return result["data"]
    }
    catch(err) { 
        console.log(err);
        throw err;
    }
}