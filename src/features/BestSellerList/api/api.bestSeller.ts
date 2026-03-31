import { BACKEND_API } from "@/shared/util/instance";

export async function API_BEST_SELLER_LIST() {
    try {
        const result = await BACKEND_API(`aladin/bestseller`, {
            searchParams : { offset : 1, limit : 15 }
        })
        .json<API_BEST_SELLER_LIST>()
        .catch<API_BEST_SELLER_LIST>();

        if(!result) throw result

        if(result["resultCode"] !== 200) return null;
        
        return result["data"];
    }
    catch(err) { 
        console.log(err);
        throw err
    }
}