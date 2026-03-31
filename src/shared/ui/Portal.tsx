"use client"

import ReactDOM from "react-dom";
import { useEffect, useState } from "react";

export const Portal = ({ children }: LAYOUT_CHILD) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const element = document.getElementById("portal-root");

  if (!element) return null;

  return ReactDOM.createPortal(children, element);
};