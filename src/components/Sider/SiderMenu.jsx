import React, { useContext } from "react";
import classes from "./SiderMenu.module.css";
import { NavLink } from "react-router-dom";
import HeaderContext from "../../context/headerContext";
export default function SiderMenu() {
  const { isMenuOpen, setIsMenuOpen } = useContext(HeaderContext);
  return (
    <>
      <ul className={classes["sider-nav"]}>
        <li>
          <NavLink
            onClick={
              isMenuOpen
                ? () => {
                    setIsMenuOpen(false);
                  }
                : undefined
            }
            className={({ isActive }) => (isActive ? classes.active : undefined)}
            to={"/"}
          >
            Trang chủ
          </NavLink>
        </li>
        <li>
          <NavLink
            onClick={
              isMenuOpen
                ? () => {
                    setIsMenuOpen(false);
                  }
                : undefined
            }
            className={({ isActive }) => (isActive ? classes.active : undefined)}
            to={"/about"}
          >
            Giới thiệu
          </NavLink>
        </li>
        <li>
          <NavLink
            onClick={
              isMenuOpen
                ? () => {
                    setIsMenuOpen(false);
                  }
                : undefined
            }
            className={({ isActive }) => (isActive ? classes.active : undefined)}
            to={"/menu"}
          >
            Menu
          </NavLink>
        </li>
        {/* <li>
          <NavLink
            onClick={
              isMenuOpen
                ? () => {
                    setIsMenuOpen(false);
                  }
                : undefined
            }
            className={({ isActive }) =>
              isActive ? classes.active : undefined
            }
            to={"/contact"}
          >
            Liên hệ
          </NavLink>
        </li> */}
      </ul>
    </>
  );
}
