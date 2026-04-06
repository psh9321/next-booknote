import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {

    interface User {
        id : string,
        name : string,
        type: "naver" | "kakao",
        profileImg : string,
        book : number,
        booknote : number
    }

    interface Session {
        user: User
        error?: "InvalidToken"
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string,
        name: string,
        type: "naver" | "kakao",
        profileImg: string,
        book : number,
        booknote : number
    }
}

export {}
