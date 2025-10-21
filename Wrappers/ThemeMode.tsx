"use client";
import use_Store from "@/store/store";
import React, { useEffect, useLayoutEffect } from "react";

function ThemeModeProvider({ children }: { children: React.ReactNode }) {
  const { Dark, setDarkMode } = use_Store();
  useLayoutEffect(() => {
    const darkMode = localStorage.getItem("dark") === "true";
    setDarkMode(darkMode);
    if (Dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (Dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [Dark]);
  return <>{children}</>;
}

export default ThemeModeProvider;
