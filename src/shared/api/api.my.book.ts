import { BACKEND_API } from "../util/instance";

export async function API_MY_UTIL_INFO(id : string) {
    try {
        const result = await BACKEND_API(`user/${id}/info/util`)
        .json<API_MY_UTIL_INFO>()
        .catch<API_MY_UTIL_INFO>()

        if(!result) throw result

        if(result["resultCode"] !== 200) return null;

        return result["data"];
    }
    catch(err) { 
        console.log(err);
        throw err;
    }
}