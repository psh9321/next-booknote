import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {

    interface USER extends MY_INFO_ITEM {
        type: "naver" | "kakao"
    }

    interface Session {
        user: USER
        error?: "InvalidToken"
    }
}

declare module "next-auth/jwt" {
    interface JWT extends MY_INFO_ITEM {
        type: "naver" | "kakao"

        /** 등록한 책 수 */
        book : number,

        /** 등록한 북노트 수 */
        booknote : number,

        /** 가입한 북클럽 수 */
        bookclub : number,

        /** 스크랩한 북노트 수 */
        scrapnote : number

    }
}

export {}
