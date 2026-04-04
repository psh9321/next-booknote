
interface RESPONSE_MODEL<T> {
    resultCode: number; /** number */
    data: T | null; /** object | string | null */
    errMsg: string; /** string */
}

class ResponseModel<T> implements CLIENT_API.RESPONSE_MODEL<T> {
    resultCode : number;
    data : T | null ;
    errMsg : string;  
    
    constructor() {
        this.resultCode = 0;
        this.data = null;
        this.errMsg = "";
    }
}

/** api 통신 성공 */
export class ApiSuccess<T> extends ResponseModel<T> {
    constructor(data : T) {
        super();

        this.resultCode = 200;
        this.data = data;
    }
}

/** api 통신 실패 */
export class ApiFail<T> extends ResponseModel<T> {
    constructor(data : any , msg : string) {
        super();

        this.resultCode = 400;
        this.data = data;
        this.errMsg = msg;
    }
}

/** api 통신 에러 */
export class ApiError<T> extends ResponseModel<T> {
    constructor(data : T, msg : string) {
        super();

        this.resultCode = 500;
        this.data = data;
        this.errMsg = msg;
    }
}

