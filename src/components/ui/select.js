"use client";

import * as React from "react";

const Select = React.forwardRef(({ children, className, ...props }, ref) => {
  return (
    <select
      className={`w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--emerald-700)] ${className}`}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";

export { Select };
