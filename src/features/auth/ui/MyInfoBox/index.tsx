import dynamic from "next/dynamic";

export const MyInfoBox = dynamic(
    () => import("./component").then(mod => mod.MyInfoBoxComponent),
    { ssr: false }
);
