"use client"

import { KakaoLogo, NaverLogo } from '@/svg/SSOLogo';
import { ActionSSOLogin } from "./actions/action.sso"
import { usePathname } from "next/navigation"

export const BeforeLogin = () => {

    const arr = [
        { type : "naver", logo : <NaverLogo/> },
        { type : "kakao", logo : <KakaoLogo/> }
    ]

    const pathname = usePathname();

    async function ClickCallback(e : React.UIEvent<HTMLButtonElement>) {
        const self = e.currentTarget;

        const type = self.dataset.type as "naver" | "kakao";

        await ActionSSOLogin(type, pathname);
    }
    
    return (
        <>
            <div className="flex justify-between items-center">
                <h3>로그인 후 더 많은 서비스를 이용해보세요.</h3>
                <ul className="flex gap-[10px]
                    [&>li>button]:flex 
                    [&>li>button]:justify-center
                    [&>li>button]:items-center
                    [&>li>button]:size-[30px]
                    [&>li>button]:rounded-[100%]
                    [&>li>button]:overflow-hidden
                    [&>li>button>svg]:size-[30px]
                ">
                    {
                        arr.map((el, i) => {
                            return (
                                <li key={`소셜로그인버튼-${el["type"]}-${i}`}>
                                    <button 
                                        data-type={el["type"]}
                                        onClick={ClickCallback} 
                                        className="flex justify-center items-center size-[30px] rounded-[100%] overflow-hidden [&>svg]:size-[30px]"
                                    >
                                        {el["logo"]}
                                    </button>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </>

    )
}