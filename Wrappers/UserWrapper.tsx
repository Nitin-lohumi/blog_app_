"use client";
import use_Store from "@/store/store";
import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
function UserWrapper({ children }: { children: React.ReactNode }) {
  const { userId, setUserId } = use_Store();
  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      const newUserId = uuidv4();
      localStorage.setItem("userId", newUserId);
    }
    setUserId(localStorage.getItem("userId")!);
  }, []);
  return <>{children}</>;
}

export default UserWrapper;
