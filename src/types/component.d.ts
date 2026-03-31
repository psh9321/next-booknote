declare global {
    interface LAYOUT_CHILD {
        children? : React.ReactNode
    }

    type ACCOUNT_STATUS = "login" | "signin" | "idSearch" | "pwSearch"
}

export {}