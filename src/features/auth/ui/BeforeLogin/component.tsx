"use client"

import { useEffect, useRef } from "react";

import { KakaoLogo, NaverLogo } from '@/svg/SSOLogo';

export const BeforeLoginComponent = () => {

    const arr = [
        { type : "naver", logo : <NaverLogo/> },
        { type : "kakao", logo : <KakaoLogo/> }
    ]

    const popupRef = useRef<Window | null>(null);

    useEffect(() => {
        function handleMessage(event: MessageEvent) {
            if (event.origin !== window.location.origin) return;
            if (event.data?.type === "SOCIAL_LOGIN_SUCCESS") {
                window.location.reload();
            }
        }

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    function ClickCallback(e: React.UIEvent<HTMLButtonElement>) {
        const self = e.currentTarget;
        const type = self.dataset.type as "naver" | "kakao";

        const callbackUrl = encodeURIComponent(`${window.location.origin}/auth/popup-callback`);
        const url = `/auth/login-redirect?provider=${type}&callbackUrl=${callbackUrl}`;

        const width = 550;
        const height = 550;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        if (popupRef.current && !popupRef.current.closed) {
            popupRef.current.focus();
            return;
        }

        popupRef.current = window.open(
            url,
            "socialLogin",
            `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
        );
    }

    return (
        <ul className="flex gap-[10px] [&>li>button]:flex  [&>li>button]:justify-center [&>li>button]:items-center [&>li>button]:size-[30px] [&>li>button]:rounded-[100%] [&>li>button]:overflow-hidden [&>li>button>svg]:size-[30px] ">
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
    )
}
