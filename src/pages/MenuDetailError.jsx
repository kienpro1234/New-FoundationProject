import React from "react";
import { useRouteError } from "react-router-dom";
import Header from "../components/Header/Header";

export default function MenuDetailError() {
  const error = useRouteError();
  let title = "An error occured";
  let message = error.message || "hello";

  return (
    <div className="errorMenu">
      <Header />
      <div className="text-center">
        <h1>{title}</h1>
        <p>{message}</p>
      </div>
    </div>
  );
}

