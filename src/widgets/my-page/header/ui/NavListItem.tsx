"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

import { forwardRef, useState } from "react";

import { CloudSync } from 'lucide-react';

import { SyncList } from "@/features/syncList";
import { useSession } from "next-auth/react";

interface NAV_LIST_ITEM {
    item : {
        title : string,
        path : string,
        status : READING_STATUS
    }
}

export const NavListItem = forwardRef<HTMLAnchorElement, NAV_LIST_ITEM>(({ item }, ref) => {

    const [isSyncList, SetIsSyncList] = useState(false);

    const { status : isLogin } = useSession();

    const pathname = usePathname();

    function SyncCallback(e : React.UIEvent<HTMLDivElement>) {

        e.preventDefault();
        SetIsSyncList(true)
    }

    return (
        <>
            <li>
                <Link
                    className="relative h-[40px] leading-[40px] text-[1.2rem] font-bold"
                    href={item["path"]}
                    ref={ref}
                >
                    {item["title"]}
                    {
                        (isLogin === "authenticated" && item["path"] === pathname) &&
                        <div onClick={e => SyncCallback(e)} className="absolute top-[-30px] right-[-30px] flex items-center gap-[5px] text-[0.8rem] cursor-pointer">동기화<CloudSync size={18}/></div>
                    }
                </Link>
            </li>

            {
                isSyncList && <SyncList status={item["status"]} cancelCallback={() => SetIsSyncList(false)}/>
            }
        </>
    )
})