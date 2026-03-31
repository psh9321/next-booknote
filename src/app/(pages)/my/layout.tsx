import { MyPageHeader } from "@/widgets/MyPageHeader";

const MyPageRoot = async ({children} : LAYOUT_CHILD) => {

    return (
        <>
            <MyPageHeader/>
            <div className="mt-[100px]">
            <div className="fixed bottom-[101px] left-1/2 -translate-x-1/2 w-[1000px] h-[calc(100%-200px)] rounded-[10px] bg-[#2a2f32] -z-1"></div>
                {children}
            </div>
        </>
    )
}

export default MyPageRoot