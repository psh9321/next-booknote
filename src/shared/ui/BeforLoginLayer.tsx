import { twMerge } from "tailwind-merge"

import { BeforeLogin } from "@/features/auth/ui/BeforeLogin"

interface BEFOR_LOGIN_LAYER {
    className? : string
}

export const BeforLoginLayer = ({ className } : BEFOR_LOGIN_LAYER) => {
    return (
        <article className={twMerge(`absolute top-[0] left-[0] flex flex-col justify-center items-center w-full h-full text-center bg-[rgba(0,0,0,0.8)] z-[3] select-none`,className??"")} >
            <h3 className="text-[1.2rem]">로그인 이 필요합니다.</h3>
            <p className="mt-[5px] mb-[50px] text-[0.9rem]">로그인 후 사용해주세요.</p>
            <div>
                <p className="mb-[15px] text-[1.1rem]">로그인</p>
                <BeforeLogin/> 
            </div>       
        </article>
    )
}