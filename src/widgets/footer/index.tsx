"use client"

import Link from 'next/link';
import Image from 'next/image';

import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

import { useState } from 'react';

import { House, User, Undo2 } from 'lucide-react';

import { NavList } from '@/features/nav/ui/NavList';
import { BeforeLogin } from '@/features/auth/ui/BeforeLogin';

import { BtnProfile } from './ui/BtnProfile';

export const Footer = () => {

    const pathname = usePathname();

    const session = useSession();

    const [ isProfile, SetIsProfile ] = useState(false);

    const profileImg = session.data?.user.profileImg;

    const isLogin = session.status === "authenticated";

    return (
        <footer className="fixed bottom-[0px] left-1/2 -translate-x-1/2 block w-full flex justify-center bg-[#0c1014] z-[3]">
            <div className='relative border-t border-t-[#2a2f32]'>
                {
                    isProfile &&
                    <article className='absolute flex justify-around leading-[2] items-center w-full h-full font-bold bg-[#0C1014] z-[2]'>
                        <h2 className="sr-only">내정보</h2>
                        <div>
                            <p className='mt-[5px]'>등록한 책 : {session.data?.user.book??0}</p>
                            <p>등록한 독서노트 : {session.data?.user.booknote??0}</p>
                        </div>
                        {
                            isLogin ?
                            <button className='border-b' onClick={() => signOut() }>로그아웃</button>
                            :
                            <div>
                                <p>로그인</p>
                                <BeforeLogin/>
                            </div>
                        }

                        <button onClick={() => SetIsProfile(false)} className='absolute top-[10px] right-[10px]'><Undo2/></button>
                    </article>
                }

                <NavList>
                    <li><Link href={"/"}><House/>홈</Link></li>
                    <li>
                        <button onClick={() => SetIsProfile(true)}>
                        {
                            profileImg ?
                            <div className='relative size-[28px] [@media(max-width:499px)]:size-[25px]'>
                                <Image src={profileImg} alt='dasd' fill className='rounded-[100%]' sizes='auto' loading="eager" />
                            </div>

                            :
                            <User/>
                        }
                        {
                            isLogin ? session.data?.user.name : "비 로그인"
                        }
                        </button>
                    </li>
                </NavList>
            </div>
        </footer>
    )
}
