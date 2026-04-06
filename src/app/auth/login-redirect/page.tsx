"use client"

import { Suspense, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { getCsrfToken } from "next-auth/react"

function LoginRedirectContent() {
    const searchParams = useSearchParams()
    const provider = searchParams.get("provider")
    const callbackUrl = searchParams.get("callbackUrl") ?? "/"
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        getCsrfToken().then((csrfToken) => {
            if (!formRef.current || !csrfToken) return;
            const input = formRef.current.querySelector<HTMLInputElement>('input[name="csrfToken"]')
            if (input) {
                input.value = csrfToken;
                formRef.current.submit();
            }
        })
    }, [])

    return (
        <form ref={formRef} method="POST" action={`/api/auth/signin/${provider}`} style={{ display: "none" }}>
            <input type="hidden" name="csrfToken" defaultValue="" />
            <input type="hidden" name="callbackUrl" defaultValue={callbackUrl} />
        </form>
    )
}

export default function LoginRedirectPage() {
    return (
        <Suspense>
            <LoginRedirectContent />
        </Suspense>
    )
}
