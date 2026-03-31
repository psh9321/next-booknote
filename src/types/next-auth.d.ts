import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            name: string
            image: string
            type: "naver" | "kakao"
            util : MY_UTIL_INFO 
        }
        error?: "InvalidToken"
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        nickName: string
        profileImg: string
        type: "naver" | "kakao"
        utilInfo : MY_UTIL_INFO
    }
}

export {}
