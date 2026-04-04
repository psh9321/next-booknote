"use client"

import { useSession } from "next-auth/react";

import { BeforeLogin } from "@/features/BeforeLogin"
import { MyInfoBox } from "@/features/MyInfoBox";
import { MyPageNavList } from "./ui/MyPageNavList";

export const MyPageHeader = () => {

    const session = useSession();

    return (
        <header className="fixed top-0 left-1/2 -translate-x-1/2 flex justify-between items-center w-[1000px] pt-[20px] bg-[#0c1014] z-[9]">
            <div className="order-last w-[370px]">
                { session.status === "unauthenticated" && <BeforeLogin/> }
                { session.status === "authenticated" && <MyInfoBox /> }
            </div>

            {/* <MyPageNavList/> */}
        </header>
    )
}