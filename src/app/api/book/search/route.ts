import { NextRequest, NextResponse } from 'next/server'
import { ALADIN_API } from '@/shared/util/instance'
import { ApiError, ApiFail, ApiSuccess } from '@/shared/util/response'

export async function POST(req: NextRequest) {
    try {
        const { keyword, offset, limit } : CLIENT_API.SEARCH_PARAMS = await req.json();

        const response = await ALADIN_API("ItemSearch.aspx", {
            searchParams: {
                Query: keyword,
                start: offset,
                maxResults: limit,
                QueryType: 'Title',
            }
        }).json<ALADIN_API.LIST_RESPONSE | ALADIN_API.ERROR_RESPONSE>()

        if ("errorCode" in response) return NextResponse.json(new ApiFail(null, response["errorMessage"]), {status : 200})

        const result = new ApiSuccess({
            total : response["totalResults"],
            page : response["startIndex"],
            limit : response["itemsPerPage"],
            keyword : response["query"],
            list : response["item"].filter(el => ![ '세트', '박스', '박스판', '컬렉션', '전집', '완전판', '합본', '전권',].some(keyword => el.title.includes(keyword) )).map(el => ({
                bookTitle : el.title,
                bookCover : el.cover,
                bookAuther : el.author,
                bookPublisher : el.publisher,
                bookCode : el.isbn
            }))??[],
        })

        return NextResponse.json(result, {status : 200})
    }
    catch (err) {
        return NextResponse.json(new ApiError(err, '검색 중 오류가 발생했습니다.'), { status: 500 })
    }
}
