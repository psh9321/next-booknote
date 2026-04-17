"use client"

import { useSession } from 'next-auth/react';

import { NavList } from '@/features/nav/ui/NavList';
import { BeforeLogin } from '@/features/auth/ui/BeforeLogin';
import { MyInfoBox } from '@/features/auth/ui/MyInfoBox';

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
