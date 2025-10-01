"use client"
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const ScrollToTop = () => {
  const pathname = usePathname(); // Next.js way to get the current route

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top whenever pathname changes
  }, [pathname]);

  return null;
};

export default ScrollToTop;
