import { Footer } from "@/widgets/footer"
import { MyPageHeader } from "@/widgets/my-page/header"

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