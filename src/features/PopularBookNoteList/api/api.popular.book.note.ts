import { BACKEND_API } from "@/shared/util/instance";

export async function API_GET_POPULAR_BOOK_NOTE() {
    try {
        const result = await BACKEND_API("booknote/popular").json<API_SERVER_GET_POPULAR_BOOK_NOTE>()
        .catch<API_SERVER_GET_POPULAR_BOOK_NOTE>()

        if(!result) throw result

        if(result["resultCode"] !== 200) return null

        return result["data"]
    }
    catch(err) { 
        console.log(err);
        throw err;
    }
}