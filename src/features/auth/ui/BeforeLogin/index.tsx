import dynamic from "next/dynamic";

export const BeforeLogin = dynamic(
    () => import("./component").then(mod => mod.BeforeLoginComponent),
    { ssr: false }
);
