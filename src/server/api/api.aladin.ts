"use server"

import { ALADIN_API } from '@/shared/util/instance';

export async function API_GET_BEST_SELLER() {
    try {
        const result = await ALADIN_API("ItemList.aspx", {
            searchParams : {
                QueryType: 'Bestseller',
                start : 1,
                maxResults : 15,
            }
        })
        .json<ALADIN_API.LIST_RESPONSE | ALADIN_API.ERROR_RESPONSE>()
        .catch();

        if("errorCode" in result) throw result;

        return result["item"];

    }
    catch(err) { 
        console.log(err);
        throw err;
    }
}

export async function API_GET_TARGET_BOOK_INFO(ItemId : string) {
    "use server"
    try {
        const result = await ALADIN_API("ItemLookUp.aspx", {
            searchParams : { ItemId }
        })
        .json<ALADIN_API.LIST_RESPONSE | ALADIN_API.ERROR_RESPONSE>()
        .catch();

        if("errorCode" in result) throw result;

        return result["item"][0];
    }
    catch(err) {
        console.log(err);
        throw err;
    }
}

  /**
   * @param Query 키워드
   */
export async function API_GET_SEARCH(Query : string, start : number, MaxResult : number) {
    try {
        const result = await ALADIN_API("ItemSearch.aspx", {
            searchParams : { 
                Query,
                start,
                MaxResult,
                }
        })
        .json<ALADIN_API.LIST_RESPONSE | ALADIN_API.ERROR_RESPONSE>()
        .catch();

        if("errorCode" in result) return result
        
        return {
            total : result["totalResults"],
            page : result["startIndex"],
            limit : result["itemsPerPage"],
            keyword : result["query"],
            items : result["item"].filter(el => ![ '세트', '박스', '박스판', '컬렉션', '전집', '완전판', '합본', '전권',].some(keyword => el.title.includes(keyword) )).map(el => ({
                bookTitle : el.title,
                bookCover : el.cover,
                bookAuther : el.author,
                bookPublisher : el.publisher,
                bookCode : el.isbn13
            }))??[]
        };
    }
    catch(err) {
        throw err
    }
  }