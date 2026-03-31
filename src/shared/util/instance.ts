import ky from "ky";

const prefixUrl = typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_BACKEND_API_URL
    : '/api/backend';

export const BACKEND_API = ky.create({
    prefixUrl,
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
