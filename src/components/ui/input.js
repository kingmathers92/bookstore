"use client";

import * as React from "react";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--emerald-700)] ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
