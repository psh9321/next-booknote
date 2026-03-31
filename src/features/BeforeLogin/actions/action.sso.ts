"use server"

import { signIn } from "@/auth";

export async function ActionSSOLogin(type : "naver" | "kakao", redirectUrl? : string) {
    await signIn(type, { redirectTo : redirectUrl??"/" })
}