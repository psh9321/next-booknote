"use client"

import ReactDOM from "react-dom";

export const Portal = ({ children } : LAYOUT_CHILD) => {

    const elements = document.getElementById("portal-root");

    if(!elements) return null;

    return ReactDOM.createPortal( children, elements );
}