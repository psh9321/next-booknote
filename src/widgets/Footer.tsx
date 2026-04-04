"use client"

import Link from 'next/link';
import Image from 'next/image';

import { User } from 'lucide-react';

import { useSession } from "next-auth/react"
import { NavList } from '@/features/NavList';

export const Footer = () => {

    const session = useSession();

    return (
        <footer className="fixed bottom-[0px] left-1/2 -translate-x-1/2 block w-full flex justify-center bg-[#0c1014] z-[3]">
            <div className='border-t border-t-[#2a2f32]'>
                <NavList>
                </NavList>
            </div>
        
        </footer>
    )
}