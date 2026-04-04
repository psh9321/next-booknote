import mongoose from "mongoose";

export async function ConnectDB<T>(fn: () => Promise<T>): Promise<T> {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.DB_CONNECT_URL!);
    }
    return await fn();
}
