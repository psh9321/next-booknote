"use client"

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useMediaQuery from "@parksuhyun9321/use-media-query";

import { BeforeLogin } from "@/features/auth/ui/BeforeLogin";

import { MyInfoBox } from "@/features/auth/ui/MyInfoBox";

import { MyPageNavList } from "./ui/MyPageNavList";

export const MyPageHeader = () => {

    const session = useSession();

    const [ isMounded, SetIsMounded ] = useState(false);

    const { isResize } = useMediaQuery(700);

    useEffect(() => {
        SetIsMounded(true);
    }, []);

    const effectiveIsResize = isMounded ? isResize : true;

    return (
        <header className="sticky top-[0] left-[0] flex justify-center items-center w-full h-[100px] bg-[#0c1014] z-[2]">
            <div className="flex justify-between items-center w-[1000px] h-full z-[9] select-none [@media(max-width:1030px)]:w-[calc(100%-30px)]">
                {
                    !effectiveIsResize &&
                    <div className="order-last w-[370px]">
                        {
                        session.status === "unauthenticated" && <div className="flex justify-between items-center">
                            <h3>로그인 후 더 많은 서비스를 이용해보세요.</h3>
                            <BeforeLogin/>
                        </div>
                        }
                        { session.status === "authenticated" && <MyInfoBox /> }
                    </div>
                }
                <MyPageNavList/>
            </div>
        </header>
    )
}
