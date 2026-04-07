"use client"

import { usePathname } from "next/navigation"

import { useLayoutEffect, useRef } from "react"

import { NavListItem } from "./NavListItem";

const opts = [
    { title : "읽는 중", path : "/my/read", status : "READ" as const },
    { title : "완독 도서", path : "/my/completed", status : "COMPLETED" as const },
    { title : "읽고 싶은 책", path : "/my/wish", status : "WISH" as const },
];

export const MyPageNavList = () => {

    const pathname = usePathname();
    const anchorRef = useRef<HTMLAnchorElement[]>([]);
    const targetBackgroundRef = useRef<HTMLLIElement>(null);
    const listWrapper = useRef<HTMLUListElement>(null);

    useLayoutEffect(() => {

        if(!targetBackgroundRef["current"]) return
        if(!listWrapper["current"]) return
        if(anchorRef["current"].length <= 0) return

        if(!pathname.includes("my")) return

        const targetAnchor = anchorRef["current"].find(el => el.getAttribute("href") === pathname) as HTMLAnchorElement;

        if(!targetAnchor) return

        const targetRect = targetAnchor.getBoundingClientRect();
        const wrapperRect = listWrapper["current"].getBoundingClientRect();

        const width = targetRect.width;
        const left = targetRect.left - wrapperRect.left;

        const targetBackground = targetBackgroundRef["current"];

        targetBackground.style.width = `${width}px`;
        targetBackground.style.left = `${left}px`;

        anchorRef["current"].forEach(el => {

            if(el.getAttribute("href") === pathname) {
                if(!el.classList.contains("active")) el.classList.add("active");
            }
            else {
                if(el.classList.contains("active")) el.classList.remove("active");
            }

            el.style.color = el.getAttribute("href") === pathname ? "#fff" : "#888"
        })

    },[pathname]);

    return (
        <nav>
            <ul ref={listWrapper} className="relative order-first flex justify-center items-center gap-[30px] my-[20px]">
                {
                    opts.map((el, i) => {
                        return <NavListItem ref={ref => { if(ref)anchorRef["current"][i] = ref } } key={`${el["title"]}-${el["path"]}-${i}`} item={el} />
                    })
                }
                <li ref={targetBackgroundRef} className={"absolute bottom-[0] left-[0] h-[3px] bg-[#fff] transition-all rounded-[10px]"}></li>
            </ul>

            {/* <SyncList status="WISH"/> */}
        </nav>
    )
}
