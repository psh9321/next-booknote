import { BACKEND_API } from "@/shared/util/instance";

export async function API_TARGET_BOOK_INFO(bookcode : string) {
    try {
        const result = await BACKEND_API(`aladin/info/book/${bookcode}`)
        .json<API_TARGET_BOOK_INFO>()
        .catch<API_TARGET_BOOK_INFO>();

        if(!result) throw result

        if(result["resultCode"] !== 200) return null;
        
        return result["data"];
    }
    catch(err) { 
        console.log(err);
        throw err;
    }
}