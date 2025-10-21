"use client";
import React from "react";
import { ToastContainer } from "react-toastify";
function ToastWrapper() {
  return (
    <ToastContainer
      theme="colored"
      position="top-center"
      autoClose={1000}
      hideProgressBar={true}
      draggable
      pauseOnHover
    />
  );
}

export default ToastWrapper;
