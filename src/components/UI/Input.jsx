import React from "react";

export default function Input({ children, className, ...props }) {
  return (
    <input
      className={`bg-white 2xl:py-2 py-1.5 px-4 outline-none focus:shadow-[0_0_4px_2px_rgba(16,185,129,0.6)] rounded-md ${className}`}
      {...props}
    >
      {children}
    </input>
  );
}
