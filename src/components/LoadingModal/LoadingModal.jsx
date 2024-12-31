import React from "react";
import LoadingIndicator from "../UI/LoadingIndicator";

export default function LoadingModal({ className = "translate-x-20" }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className={`relative ${className}`}>
        <LoadingIndicator />
      </div>
    </div>
  );
}
