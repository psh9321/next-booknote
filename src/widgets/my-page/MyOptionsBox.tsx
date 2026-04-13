"use client"

import dynamic from 'next/dynamic';

import { useSession } from 'next-auth/react';

import { NavList } from '@/features/nav/ui/NavList';

const BeforeLogin = dynamic(import("@/features/auth/ui/BeforeLogin").then(rs => ({default:rs.BeforeLogin})));

const MyInfoBox = dynamic(import("@/features/auth/ui/MyInfoBox").then(rs => ({default:rs.MyInfoBox})));

export const MyOptionsBox = () => {

    const session = useSession();

    return (
        <>
            {
                session.status === "unauthenticated" &&
                <div className="flex justify-between items-center">
                    <h3>로그인 후 더 많은 서비스를 이용해보세요.</h3>
                    <BeforeLogin/>
                </div>
            }
            { session.status === "authenticated" && <MyInfoBox/> }

            <NavList className='inline-flex justify-start mt-[30px]'/>
        </>
    )
}
