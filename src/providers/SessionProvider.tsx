"use client"

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"

const SessionProvider = ({ children }: LAYOUT_CHILD) => {
    return (
        <NextAuthSessionProvider refetchOnWindowFocus={false}>
            {children}
        </NextAuthSessionProvider>
    )
}

export default SessionProvider
