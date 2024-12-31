import React, { useContext } from "react";
import classes from "./HeaderUser.module.css";
import Header from "./Header";
import { loginContext } from "../../context/loginContext";
import useLogout from "../../hooks/useLogout";
import { Link, redirect } from "react-router-dom";
import { getToken } from "../../utils/util";
export default function HeaderUser({ user }) {
  //lấy ra handleLogout để logout, remove AT và setIsLogin = false
  const { handleLogout, navigate } = useLogout();
  const token = getToken();
  if (!token) {
    navigate("/menu/all");
  }

  return (
    <div className={`${classes.headerUser} d-flex justify-content-between align-items-center`}>
      <div className={`${classes.logo}`}>
        <Link to="/menu">
          <img
            src="https://img.freepik.com/premium-vector/restaurant-logo-design_1128391-17280.jpg"
            alt="logo restaurant"
          />
        </Link>
      </div>
      <div className={`${classes.navbar}`}>
        <ul className={`${classes["headerUser-ul"]} d-flex align-items-center gap-10`}>
          <Header className="position-relative" style={{ transform: "translateY(-35%)", minWidth: "180px" }} />
          <div className="d-flex align-items-center gap-2">
            <li>
              <img className={classes.avatar} src={user.imageUrl} alt={"avatar"} />
            </li>
            <li className={`${classes.username} fw-bold flex flex-col text-white`} style={{ fontSize: "1.8rem" }}>
              {user.lastName + " " + user.firstName}

              <button onClick={handleLogout} className="text-left text-xs md:text-sm">
                Đăng xuất
              </button>
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
}
