import type { Metadata } from "next";

import { DIST_VER } from "version"

import "./style.css";

import QueryProvider from "@/providers/QueryProvider";
import SessionProvider from "@/providers/SessionProvider";
import { LoadingView } from "@/shared/ui/loadingView";

export const metadata: Metadata = {
    metadataBase: new URL("https://booknote.psh9321-portfolio.p-e.kr"),
    creator : "프론트엔드 개발자 박수현",
    publisher : "프론트엔드 개발자 박수현",
    title: {
        default: "북노트",
        template: "%s | 독서기록 플랫폼",
    },
    description: "전국 전시 정보를 한눈에 확인하세요",
    keywords : ["북노트", "독서", "읽고싶은", "읽는중", "완독 도서", "book", "book log", "book log"],
    appLinks : {
        web : {
        url : "https://booknote.psh9321-portfolio.p-e.kr",
        should_fallback : true,
        }
    },
    category : "독서",
    other : {
        custom : "meta"
    },
    robots : {
        index : true,
        follow : true,
    },
};
 
const RootLayout = ({ children } : LAYOUT_CHILD) => {

    return (
        <html lang="ko">
        <body suppressHydrationWarning>
            <SessionProvider>
                  <QueryProvider>
                    {children}
                    <div id="portal-root"></div>
                  </QueryProvider>
            </SessionProvider>
            <LoadingView/>
            <h2 className="sr-only">{DIST_VER}</h2>
        </body>
        </html>
    )
}

export default RootLayout
