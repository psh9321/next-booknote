"use client"

import { useEffect } from "react";

export default function PopupCallbackPage() {
    useEffect(() => {
        if (window.opener) {
            window.opener.postMessage({ type: "SOCIAL_LOGIN_SUCCESS" }, window.location.origin);
            window.close();
        }
    }, []);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <p>로그인 중...</p>
        </div>
    );
}
