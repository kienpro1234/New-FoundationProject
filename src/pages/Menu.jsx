import React from "react";
import MenuComponent from "../components/Menu/MenuComponent";
import { Outlet } from "react-router-dom";
import MenuLanding from "../components/Menu/MenuLanding";
import Footer from "../components/Footer/Footer";

export default function Menu() {
  return (
    <div className="menu">
      <MenuLanding />
      <MenuComponent />
      <Outlet />
      <Footer />
    </div>
  );
}
