"use client"

import Image from 'next/image';

import { signOut } from 'next-auth/react';

import { KakaoLogo, NaverLogo } from '@/svg/SSOLogo';

interface MY_INFO_BOX {
    name : string,
    type : string,
    profileImg : string
}

export const MyProfileBox = ({ name, type, profileImg } : MY_INFO_BOX) => {

    return (
        <div className='flex items-center'>
            <div className='relative w-[60px] h-[60px] bg-[#f0f] rounded-[100%] overflow-hidden'>
                <Image src={profileImg} alt={`${name} 의 ${type} 프로필 이미지`} fill sizes="auto" loading="eager" />
            </div>
            <dl className='ml-[15px] [&>dd]:inline-block [&>dd]:text-[0.9rem]'>
                <dt className='flex items-center text-[1.1rem] [&>svg]:mr-[5px]'>
                    { type === "naver" && <NaverLogo/> }
                    { type === "kakao" && <KakaoLogo/> }
                    {name}
                </dt>
                <dd>팔로잉 : 1</dd>
                <dd className='ml-[15px]'>팔로워 : 0</dd>
            </dl>

            <button className='ml-auto border-b' onClick={() => signOut()}>
                로그아웃
            </button>
        </div>
    )
}