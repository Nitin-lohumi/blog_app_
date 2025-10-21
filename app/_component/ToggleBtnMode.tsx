"use client";
import use_Store from "@/store/store";
import React from "react";
import { CiDark, CiLight } from "react-icons/ci";
function ToggleBtnMode() {
  const { Dark, setDarkMode } = use_Store();
  return (
    <div className="flex items-center gap-2 p-2">
      <label htmlFor="Theme" className="cursor-pointer">
        {Dark ? <CiLight size={30} /> : <CiDark size={30} />}
      </label>
      <button onClick={() => setDarkMode(!Dark)} id="Theme" hidden/>
    </div>
  );
}

export default ToggleBtnMode;
