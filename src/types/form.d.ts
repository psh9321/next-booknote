import z from "zod";

import { idSearchSchema, loginSchema } from "@/features/AccountView/model/login.model";
declare global {

    type LOGIN_PARAMS = z.infer<typeof loginSchema>;

    type SEARCH_ID_PARAMS = z.infer<typeof idSearchSchema>;
}

export {}