import { redirect } from "next/navigation"

const MyPageServer = async () => {
    return redirect("/my/read")
}

export default MyPageServer