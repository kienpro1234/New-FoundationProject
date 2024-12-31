import React from "react";
import classes from "./ButtonUserInfo.module.css";

export default function Button({ children, className, ...props }) {
  return (
    <button {...props} className={`${className} ${classes.button}`}>
      {children}
    </button>
  );
}
