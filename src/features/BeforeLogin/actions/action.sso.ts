"use server"

import { redirect } from "next/navigation";

export async function ActionSSOLogin(type : "naver" | "kakao", redirectUrl? : string) {
    const callbackUrl = encodeURIComponent(redirectUrl ?? "/");
    redirect(`/api/auth/signin/${type}?callbackUrl=${callbackUrl}`);
}
