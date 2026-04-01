import { BACKEND_API } from "@/shared/util/instance";

export async function API_GET_MY_SCRAP_BOOK_NOTE_LIST(id : string, offset : number, limit = 15) {
    try {

        const result = await BACKEND_API(`scrap/booknote/my/${id}`, {
            searchParams : { offset, limit }
        })
        .json<API_GET_MY_SCRAP_BOOK_NOTE_LIST>()
        .catch()

        if(!result) throw result

        if(result["resultCode"] !== 200) return null;
        
        return result["data"];
    }
    catch(err) { 
        console.log(err);
        throw err;
    }
}