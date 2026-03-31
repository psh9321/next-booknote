import ky from "ky";

export const BACKEND_API = ky.create({
    prefixUrl : process.env.NEXT_PUBLIC_BACKEND_API_URL,
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
