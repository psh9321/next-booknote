"use client"

import { useSession, signOut } from 'next-auth/react';

import { Undo2 } from 'lucide-react';

import { BeforeLogin } from '@/features/auth/ui/BeforeLogin';

interface FOOTER_PROFILE_PANEL {
    onClose: () => void
}

export const FooterProfilePanel = ({ onClose }: FOOTER_PROFILE_PANEL) => {

    const session = useSession();

    const isLogin = session.status === "authenticated";

    return (
        <article className="absolute flex justify-around leading-[2] items-center w-full h-full font-bold bg-[#0C1014] z-[2]">
            <h2 className="sr-only">내정보</h2>
            {
                isLogin ?
                <>
                    <div>
                        <p className='mt-[5px]'>등록한 책 : {session.data?.user.book??0}</p>
                        <p>등록한 독서노트 : {session.data?.user.booknote??0}</p>
                    </div>
                    <button className='border-b' onClick={() => signOut()}>로그아웃</button>
                </>
                :
                <>
                    <p className='[@media(max-width:499px)]:text-[0.75rem]'>로그인 후 더 많은 서비스를 이용해보세요.</p>
                    <div>
                        <p className='mb-[5px] text-[0.9rem]'>로그인</p>
                        <BeforeLogin/>
                    </div>
                </>
            }
            <button onClick={onClose} className='absolute top-[10px] right-[10px]'><Undo2/></button>
        </article>
    )
}
