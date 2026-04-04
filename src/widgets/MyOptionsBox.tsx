"use client"

import { useSession } from 'next-auth/react';

import { BeforeLogin } from '@/features/BeforeLogin';
import { MyInfoBox } from '@/features/MyInfoBox';
import { NavList } from '@/features/NavList';

export const MyOptionsBox = () => {

    const session = useSession();

    return (
        <>
            { session.status === "unauthenticated" && <BeforeLogin/> }
            { session.status === "authenticated" && <MyInfoBox/> }

            <NavList className='inline-flex justify-start mt-[30px]'/>
        </>
    )
}