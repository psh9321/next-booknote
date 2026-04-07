export const emptyContents : {
    [key in READING_STATUS] : {
        title : string,
        txt : string,
        anchorTxt : string
    }
} = {
    "READ": {
        title : "현재 읽고 있는 도서가 없습니다.",
        txt : "읽어볼 도서를 찾아보세요.",
        anchorTxt : "읽을 책 찾기"
    },
    "WISH" : {
        title : "현재 읽고 싶은 도서가 없습니다.",
        txt : "읽고싶은 도서를 찾아보세요.",
        anchorTxt : "읽고 싶은 책 찾기"
    },
    "COMPLETED" : {
        title : "현재 완독한 도서가 없습니다.",
        txt : "읽어볼 도서를 찾아보세요.",
        anchorTxt : "다 읽은 찾기"
    },
}