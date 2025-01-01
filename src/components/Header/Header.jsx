import React, { Fragment, useContext, useEffect, useRef, useState } from "react";
import classes from "./Header.module.css";
import { createSearchParams, Link, useLocation, useNavigate } from "react-router-dom";
import { getRoleLS, getToken } from "../../utils/util";
import Modal from "../UI/Modal";
import AddFoodForm from "../AddFood/AddFoodForm";
import { toast } from "react-toastify";
import { FavContext } from "../../context/favContext";
import { CartContext } from "../../context/cartContext";
import { RiAdminFill } from "react-icons/ri";
import { useQuery } from "@tanstack/react-query";
import { fetchFavList } from "../../apis/fav.api";
import { fetchCartAmount } from "../../apis/cart.api";

//THêm class riêng cho esapase, tắt luôn, chứ k chờ
export default function Header({ className, ...props }) {
  //Dùng redux hay context api quản lý state sau
  let favList = [];
  const { favList: favListContext } = useContext(FavContext);
  const cartId = localStorage.getItem("cartId");
  const { userId } = useContext(CartContext);
  const inputDiv = useRef(null);
  const inputRef = useRef(null);
  const [searchKeyWord, setSearchKeyWord] = useState("");

  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Kiểm tra nếu có accessToken thì setIsLogin = true để bên dưới render có điều kiện
  //isLogin ở đây khác với isLogin

  const token = getToken();

  const handleClickOutside = (event) => {
    if (inputDiv.current && !inputDiv.current.contains(event.target)) {
      setIsSearching(false);
    }
  };

  const handleEscDown = (event) => {
    if (event.key === "Escape") {
      setIsSearching(false);
    }
  };

  const handleSearchClick = () => {
    setIsSearching(() => {
      inputRef.current.focus();
      return true;
    });
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscDown);
    };
  });

  const handleChange = (e) => {
    const { value, name } = e.target;

    setSearchKeyWord(value);
  };

  const getFavQuery = useQuery({
    queryKey: ["favList", userId],
    queryFn: () => fetchFavList(userId),
    enabled: Boolean(token),
  });

  if (!token) {
    favList = favListContext;
  } else {
    console.log("run 1");
    if (getFavQuery.data) {
      favList = getFavQuery.data.data.data.pageContent;
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!searchKeyWord) {
      toast.warning("Không được bỏ trống", {
        position: "top-center",
      });
      return;
    }

    navigate({
      pathname: "/menu/search",
      search: createSearchParams({
        name: searchKeyWord,
      }).toString(),
    });

    setSearchKeyWord("");
  };

  console.log("tokennnn", Boolean(cartId));

  const cartAmountQuery = useQuery({
    queryKey: ["cartAmount", userId],
    queryFn: () => fetchCartAmount(cartId),
    enabled: Boolean(cartId),
  });

  let cartAmount = 0;
  if (cartAmountQuery.data) {
    cartAmount = cartAmountQuery.data.data.data.elementAmount;
  }

  let content;

  if (location.pathname === "/userinfo") {
    content = (
      <div>
        <Link to={"/menu"} className="text-white">
          <button>
            <i className="fa fa-home"></i>
          </button>
        </Link>
      </div>
    );
  } else {
    content = (
      <>
        <form onSubmit={handleSubmit}>
          <div ref={inputDiv} className={classes["header-search"]}>
            <input
              ref={inputRef}
              className={`${isSearching ? classes["search-open"] : classes["search-close"]}`}
              type="text"
              value={searchKeyWord}
              onChange={handleChange}
            />

            <button
              type="submit"
              className={`${isSearching ? classes["button-search-open"] : "hidden"}`}
              onClick={handleSearchClick}
            >
              <i className="fa fa-search"></i>
            </button>

            <button
              type="button"
              className={`${isSearching ? "hidden" : classes["button-search"]}`}
              onClick={handleSearchClick}
            >
              <i className="fa fa-search"></i>
            </button>
            {/* <button
              className={`${isSearching ? classes["button-search-open"] : classes["button-search"]}`}
              onClick={handleSearchClick}
            >
              <i className="fa fa-search"></i>
            </button> */}
          </div>
        </form>

        {token ? (
          <div className={classes["header-auth"]}>
            <Link to={"/userinfo"}>
              <button>
                <i className="fa fa-user"></i>
              </button>
            </Link>
          </div>
        ) : (
          <div className={classes["header-auth-notLog"]}>
            <Link>
              <button>
                <i className="fa fa-user"></i>
              </button>
            </Link>
            <div className={`${classes["login-menu-container"]}`}>
              <ul className={`${classes["login-menu"]}`}>
                <Link to={"/register"} className="text-sm text-slate-800 hover:text-slate-800">
                  <li className="mb-2">Sign up</li>
                </Link>
                <Link to={"/login"} className="text-sm text-slate-800 hover:text-slate-800">
                  <li>Sign in</li>
                </Link>
                <div className={`${classes["login-menu-overlay"]}`}></div>
              </ul>
            </div>
          </div>
        )}
      </>
    );
  }

  const role = getRoleLS();

  return (
    <div className={`${classes.header} ${className}`} {...props}>
      {content}

      <div className={`${classes["header-fav"]} relative`}>
        <Link to={"/fav"}>
          <button>
            <i className="fa fa-heart"></i>
          </button>
          {favList.length > 0 && (
            <span className="absolute -top-1 left-0 flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {favList.length}
            </span>
          )}
        </Link>
      </div>
      <div className={`${classes["header-cart"]} relative`}>
        <button>
          <Link to={"/cart"} className="fa fa-shopping-cart text-white"></Link>
        </button>
        {cartAmount > 0 && (
          <span className="absolute -top-1 left-0 flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {cartAmount}
          </span>
        )}
      </div>
      {role === "admin" && (
        <Fragment>
          <div className={classes["header-addFood"]}>
            {/* Button kích hoạt Modal */}
            <Modal
              title="Thêm mới dữ liệu"
              id="addModal"
              size="lg" // md, sm
              triggeredButton={
                <button>
                  <i className="fa-solid fa-plus"></i>
                </button>
              }
            >
              {/* Nội dung bên trong modal */}
              {/* component form sẽ thêm ở đây  */}
              <AddFoodForm />
            </Modal>
          </div>
          <div className={`${classes["header-cart"]} relative`}>
            <button className="flex items-center justify-center">
              <Link to={"/admin"}>
                <RiAdminFill color="white" />
              </Link>
            </button>
          </div>
        </Fragment>
      )}
    </div>
  );
}
