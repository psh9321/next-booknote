import { MyPageHeader } from "@/widgets/MyPageHeader";

const MyPageRoot = async ({children} : LAYOUT_CHILD) => {

    return (
        <>
            <MyPageHeader/>
            <div className="min-h-[calc(100dvh-220px)] mt-[100px] p-[20px] bg-[#2A2F32] rounded-[10px]">
                {children}
            </div>
        </>
    )
}

export default MyPageRoot