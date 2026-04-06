"use client"

import Link from 'next/link';
import Image from 'next/image';

import { useSession, signOut } from 'next-auth/react';

import { KakaoLogo, NaverLogo } from '@/svg/SSOLogo';

export const MyInfoBox = () => {

    const session = useSession();

    const type = session.data?.user?.type;

    const name = session.data?.user?.name;

    const profileImg = session.data?.user?.profileImg?.replace("http://","https://");

    return (
        <div className='flex items-center'>
            <Link href={"/"} className='relative flex justify-center items-center size-[60px] border rounded-[100%] overflow-hidden'>
            {
                profileImg && <Image fill src={profileImg} alt={`프로필 이미지`} sizes="auto" loading="eager" className='object-cover' />
            }
            </Link>          
            <dl className='ml-[15px] select-none [&>dd]:inline-block [&>dd]:text-[0.9rem]'>
                <dt className='flex items-center mb-[10px] text-[1.1rem] [&>svg]:mr-[10px]'>
                    { type === "naver" && <NaverLogo/> }
                    { type === "kakao" && <KakaoLogo/> }
                    {name}
                </dt>
                <dd>등록한 책 : {session.data?.user.book??0}</dd>
                <dd className='ml-[15px]'>등록한 독서노트 : {session.data?.user.booknote??0}</dd>
            </dl>       
            <button className='ml-auto border-b' onClick={() => signOut()}>
                로그아웃
            </button> 
        </div>

    )
}