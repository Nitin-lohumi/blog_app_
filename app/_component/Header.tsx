"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ToggleBtnMode from "./ToggleBtnMode";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Header() {
  const path = usePathname().split("/")[1];
  const [showHeader, setShowHeader] = useState(true);
  const lastScroll = useRef(0);

  const handleScroll = useCallback(() => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScroll.current && window.scrollY > 10) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScroll.current = window.scrollY;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 flex items-center dark:bg-gray-950/70 bg-white/70 justify-between p-3
         transition-transform duration-300 ${
           showHeader ? "translate-y-0" : "-translate-y-full"
         }`}
    >
      <div>
        <h2 className="pl-3 font-bold">BLOG Platform</h2>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className={`${
            path === "" ? "dark:text-green-500 font-bold text-blue-700" : ""
          }`}
        >
          Home
        </Link>
        <Link
          href="/create_post"
          className={`${
            path === "create_post"
              ? "dark:text-green-500 font-bold text-blue-700"
              : ""
          }`}
        >
          Create Post
        </Link>
        <ToggleBtnMode />
      </div>
    </div>
  );
}

export default Header;
