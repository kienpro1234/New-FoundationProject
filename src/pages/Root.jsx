import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Sider from "../components/Sider/Sider";
import Header from "../components/Header/Header";
import { useMediaQuery } from "react-responsive";
import HeaderMobile from "../components/Header/HeaderMobile";
import SearchContext from "../context/headerContext";
import SiderMenu from "../components/Sider/SiderMenu";

export default function Root() {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { isSearching, isMenuOpen } = useContext(SearchContext);
  let content = <></>;

  if (!isSearching && !isMenuOpen) {
    content = (
      <main>
        <Outlet />
      </main>
    );
  }
  if (isMenuOpen) {
    content = (
      <div className="menu-mobile-wrapper">
        <div className="siderMenuWrapper-mobile">
          <SiderMenu />
        </div>
        <div className="sider-footer-mobile">
          <div>
            <div className="sider-contact">
              <p>
                <i className="fa fa-clock"></i> 10:00 - 18:00
              </p>
              <p>
                <i className="fa fa-phone"></i> 1900 633 818
              </p>
            </div>
          </div>
          <div className="sider-icon">
            <i className="fab fa-facebook-f text-primary"></i>
            <i className="fab fa-instagram text-danger"></i>
            <i className="fab fa-github"></i>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh" }}>
      <Sider />
      {isMobile ? <HeaderMobile /> : <Header />}
      {content}
    </div>
  );
}
