import ky from "ky";

const prefixUrl = typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_BACKEND_API_URL
    : '/api/backend';

export const CLIENT_API = ky.create({
    prefixUrl : `/api`,
    method : "post",
    timeout : 10000,
    hooks : {
        beforeRequest : [
            async req => {
                return req;
            }
        ],

        beforeError : [
            async error => {
                return error
            }
        ],

        afterResponse : [
            async (req, _options, response) => {
                return response;
            }
        ],
    }
})

export const ALADIN_API = ky.create({
    prefixUrl : process.env.ALADIN_API_URL,
    timeout : 10000,
    searchParams : {
        ttbkey : process.env.ALADIN_API_SECRET_KEY,
        Version : "20131101",
        output : "JS",
        cover: 'MidBig',
        SearchTarget: 'Book',
        SubSearchTarget: 'Book',
    },
    hooks : {
        beforeRequest : [
            async req => {
                return req
            }
        ],

        beforeError : [
            async error => {
                return error
            }
        ],

        afterResponse : [
            async ( request, options, response) => {

                return response
            }
        ],
    }
})