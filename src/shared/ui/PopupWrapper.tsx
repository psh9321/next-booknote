import { Portal } from "./Portal"

export const PopupWrapper = ({children} : LAYOUT_CHILD) => {
    
    return (
        <Portal>
            <div className="fixed top-0 left-0 flex flex-col justify-center items-center w-dvw h-dvh z-9 bg-[rgba(0,0,0,0.7)]">
                {children}
            </div>
        </Portal>
    )
}