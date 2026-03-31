"use client"

import { useSession } from "next-auth/react";

import { BeforeLogin } from "@/features/BeforeLogin"
import { MyProfileBox } from "@/features/MyProfileBox"
import { MyPageNavList } from "./ui/MyPageNavList";

export const MyPageHeader = () => {

    const session = useSession();

    const profileImg = session.data?.user?.profileImg?.replace(/^http:\/\//, "https://");

    return (
        <header className="fixed top-0 left-1/2 -translate-x-1/2 flex justify-between w-[1000px] pt-[20px] bg-[#0c1014] z-[9]">
            <div className="order-last w-[350px]">
                { session.status === "unauthenticated" && <BeforeLogin/> }
                {
                    session.status === "authenticated" && <MyProfileBox name={session.data?.user.name} type={session.data?.user.type} profileImg={profileImg!}/>
                }
            </div>

            <MyPageNavList/>
        </header>
    )
}