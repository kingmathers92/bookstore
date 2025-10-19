"use client";

import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";

export const ToastProvider = ({ children }) => {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      {children}
    </>
  );
};

export const showSuccess = (message) => toast.success(message);
export const showError = (message) => toast.error(message);
export const showInfo = (message) => toast(message);

export const Toast = () => null;
