"use client"

import Image from 'next/image';

import { User } from 'lucide-react';

import { useSession } from "next-auth/react"
import { useEffect, useRef, useState } from 'react';

import { BeforeLogin } from '@/features/auth/ui/BeforeLogin';

import { Portal } from '@/shared/ui/Portal';

export const BtnProfile = () => {

    const [isProfile, SetIsProfile] = useState(false);

    const session = useSession();

    const btnRef = useRef<HTMLButtonElement>(null);
    const profileBoxRef = useRef<HTMLDivElement>(null);

    const profileImg = session.data?.user.profileImg;

    function ProfileBoxSetLocation() {
        if(!btnRef["current"]) return
        if(!profileBoxRef["current"]) return

        const btnRect = btnRef["current"].getBoundingClientRect();

        const profileBox = profileBoxRef["current"];

        profileBox.style.top = `${(btnRect["top"] - profileBox.clientHeight) - 18}px`;

        profileBox.style.left = `${(btnRect["left"] - profileBox.clientWidth/2) + 25}px`
    }

    function ResizeCallback() { ProfileBoxSetLocation() }

    useEffect(() => {

        ProfileBoxSetLocation()

        if(isProfile) {
            window.addEventListener("resize", ResizeCallback);
        }
        else {
            window.removeEventListener("resize", ResizeCallback);
        }

        return () => {
            window.removeEventListener("resize", ResizeCallback);
        }

    },[isProfile])

    return (
        <>
            {
                isProfile &&
                <Portal>
                    <div onClick={() => SetIsProfile(false)} className='fixed top-0 left-0 w-full h-full z-[99]'>
                        <div ref={profileBoxRef} className="absolute leading-[2] p-[10px_20px] text-left bg-[#888] rounded-[10px] z-[9999] after:content-[''] after:absolute after:bottom-[-35px] after:left-1/2 after:-translate-x-1/2 after:border-[18px] after:border-solid after:border-transparent after:border-t-[#888] [&>p]:text-[1.05rem] [@media(max-width:470px)]:[&>p]:text-[0.8rem]">
                            <div className='flex justify-between items-center '><span className='mr-[5px] text-[1.05rem] [@media(max-width:470px)]:[&>p]:text-[0.8rem]'>로그인</span> <BeforeLogin/></div>
                            <p className='mt-[5px]'>등록한 책 : {session.data?.user.book??0}</p>
                            <p>등록한 독서노트 : {session.data?.user.booknote??0}</p>
                        </div>
                    </div>
                </Portal>
            }
            <li>
                <button ref={btnRef} onClick={() => SetIsProfile(true)}>
                    {
                        profileImg ?
                        <Image src={profileImg} alt='dasd' width={35} height={35} className='rounded-[100%]' sizes='auto' loading="lazy" />
                        :
                        <User/>
                    }
                    {
                        session.status === "authenticated" ? session.data?.user.name : "비 로그인"
                    }
                </button>
            </li>
        </>

    )
}
