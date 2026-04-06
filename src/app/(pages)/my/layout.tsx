import { Footer } from "@/widgets/Footer"
import { MyPageHeader } from "@/widgets/MyPageHeader"

const MyPageRoot = ({children} : LAYOUT_CHILD) => {
    
    return (
        <>
            <MyPageHeader/>
            <div className="w-[1000px] mx-auto [@media(max-width:1030px)]:w-full">   
                {children}   
            </div>
            <Footer/>
        </>
    )
}

export default MyPageRoot