"use client";

import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

const CustomToast = ({ type, message, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -50, scale: 0.9 }}
    className={`
      flex items-center gap-3 p-4 rounded-2xl shadow-lg backdrop-blur-md border
      ${type === "success" ? "bg-emerald-50/90 border-emerald-200 text-emerald-800" : ""}
      ${type === "error" ? "bg-red-50/90 border-red-200 text-red-800" : ""}
      ${type === "info" ? "bg-blue-50/90 border-blue-200 text-blue-800" : ""}
      ${type === "warning" ? "bg-amber-50/90 border-amber-200 text-amber-800" : ""}
    `}
  >
    <div
      className={`
      p-2 rounded-full
      ${type === "success" ? "bg-emerald-100" : ""}
      ${type === "error" ? "bg-red-100" : ""}
      ${type === "info" ? "bg-blue-100" : ""}
      ${type === "warning" ? "bg-amber-100" : ""}
    `}
    >
      <Icon className="w-5 h-5" />
    </div>
    <span className="font-medium">{message}</span>
  </motion.div>
);

export const ToastProvider = ({ children }) => {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName="!top-20"
        toastOptions={{
          duration: 4000,
          style: {
            background: "transparent",
            boxShadow: "none",
            padding: 0,
            margin: 0,
          },
        }}
      />
      {children}
    </>
  );
};

export const showSuccess = (message) => {
  toast.custom(<CustomToast type="success" message={message} icon={CheckCircle} />, {
    duration: 3000,
  });
};
export const showError = (message) => {
  toast.custom(<CustomToast type="error" message={message} icon={XCircle} />, { duration: 4000 });
};
export const showInfo = (message) => {
  toast.custom(<CustomToast type="info" message={message} icon={Info} />, { duration: 3000 });
};
export const showWarning = (message) => {
  toast.custom(<CustomToast type="warning" message={message} icon={AlertTriangle} />, {
    duration: 3500,
  });
};

export const showLoading = (message) => {
  return toast.custom(
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-3 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200"
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 border-2 border-burgundy/20 border-t-burgundy rounded-full"
        />
      </div>
      <span className="font-medium text-gray-800">{message}</span>
    </motion.div>,
    { duration: Infinity },
  );
};

export const Toast = () => null;
