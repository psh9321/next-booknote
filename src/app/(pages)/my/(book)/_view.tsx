"use client"

import { useSession } from "next-auth/react";

import { MyBookBox } from "@/widgets/MyBookBox";

const MyPageView = () => {

    const session = useSession();

    return (
        <>
            <h1 className="sr-only">내 서재 페이지</h1>
            <main className="w-full mx-auto">
                <MyBookBox userId={session.data?.user.id as string}/>
            </main>
        </>
    )
}

export default MyPageView
