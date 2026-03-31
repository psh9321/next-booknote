declare global {
    interface MY_INFO {

        /** 유저 아이디 */
        id : string,

        /** 유저 이름 */
        name : string,

        /** 프로필 이미지 */
        profileImg : string | null,

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