"use client"

import { useSession } from 'next-auth/react';

import { MyProfileBox } from '@/features/MyProfileBox';

import { BeforeLogin } from '@/features/BeforeLogin';
import { MyOptionList } from '@/features/MyOptionsList';


export const MyOptionsBox = () => {

    const session = useSession();

    const sessionStatus = session.status;

    const profileImg = session.data?.user?.image.replace(/^http:\/\//, "https://");

    const util = session.data?.user.util;
    
    return (
        <article className='w-full'>
            <h3 className="inline-block mb-[20px] font-[700] text-[1.2rem]">내 정보</h3>
            {
                session.status === "unauthenticated" && <BeforeLogin/>
            }
            {
                session.status === "authenticated" && <MyProfileBox name={session.data?.user.name} type={session.data?.user.type} profileImg={profileImg!}/>
            }
            <MyOptionList data={util as MY_UTIL_INFO} />
        </article>
    )
}