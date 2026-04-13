"use client"

import Link from 'next/link';
import Image from 'next/image';

import dynamic from 'next/dynamic';

import { useSession } from 'next-auth/react';

import { useState } from 'react';

import { House, User } from 'lucide-react';

import { NavList } from '@/features/nav/ui/NavList';

const FooterProfilePanel = dynamic(
    () => import('./FooterProfilePanel').then(m => m.FooterProfilePanel),
    { ssr: false }
);

export const Footer = () => {

    const session = useSession();

    const [ isProfile, SetIsProfile ] = useState(false);

    const profileImg = session.data?.user.profileImg;

    const isLogin = session.status === "authenticated";

    return (
        <footer className="fixed bottom-[0px] left-1/2 -translate-x-1/2 block w-full flex justify-center bg-[#0c1014] z-[3]">
            <div className='relative border-t border-t-[#2a2f32]'>
                {
                    isProfile && <FooterProfilePanel onClose={() => SetIsProfile(false)} />
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
                            isLogin ? session.data?.user.name : "로그인"
                        }
                        </button>
                    </li>
                </NavList>
            </div>
        </footer>
    )
}
