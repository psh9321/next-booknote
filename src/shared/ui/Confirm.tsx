import { Portal } from "./Portal"

export const Confirm = ({ 
    title, 
    contents, 
    cancelBtnTxt, 
    submitBtnTxt, 
    cancelCallback, 
    submitCallback 
} : {
    title : string,
    contents : string,
    cancelBtnTxt? : string,
    submitBtnTxt? : string,
    cancelCallback : () => void
    submitCallback : () => void
}) => {
    return (
        <Portal>
            <div className="fixed top-[0] left-[0] flex justify-center items-center w-full h-full z-[999] bg-[rgba(0,0,0,0.6)]">
                <div className="block p-[30px_60px] text-center font-bold bg-[#2A2F32] rounded-[10px] ">
                    <dl>
                        <dt className="mb-[20px] text-[1.4rem] [@media(max-width:499px)]:text-[1.2rem]">{title}</dt>
                        <dd className="text-[0.9rem] [@media(max-width:499px)]:text-[0.7rem]" dangerouslySetInnerHTML={{__html : contents}}></dd>
                    </dl>
                    <ul className="flex justify-center mt-[30px] gap-[10px] [&>li>button]:p-[5px_15px] [&>li>button]:border [&>li>button]:rounded-[5px] [@media(max-width:499px)]:[&>li>button]:text-[0.8rem]">
                        <li><button onClick={cancelCallback} >{cancelBtnTxt??"취소"}</button></li>
                        <li><button onClick={submitCallback}>{submitBtnTxt??"확인"}</button></li>
                    </ul>
                </div>
            </div>
        </Portal>

    )
}