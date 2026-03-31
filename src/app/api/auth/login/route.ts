import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const { accessToken, refreshToken } = await req.json()

    const cookieStore = await cookies()
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
    }

    cookieStore.set("accessToken", accessToken, cookieOptions)
    cookieStore.set("refreshToken", refreshToken, cookieOptions)

    return NextResponse.json({ ok: true })
}

export async function DELETE() {
    const cookieStore = await cookies()
    cookieStore.delete("accessToken")
    cookieStore.delete("refreshToken")
    return NextResponse.json({ ok: true })
}
