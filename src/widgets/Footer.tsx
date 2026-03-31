"use client"

import { NavList } from '@/features/NavList';

export const Footer = () => {

    return (
        <footer className="fixed bottom-[0px] left-1/2 -translate-x-1/2 block w-full flex justify-center bg-[#0c1014] z-[3]">
            <NavList/>
        </footer>
    )
}