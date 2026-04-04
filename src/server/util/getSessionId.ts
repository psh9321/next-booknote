import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth";

export async function GetSessionId() {
    const session = await getServerSession(authOptions);
    return session?.user.id ?? null;
}