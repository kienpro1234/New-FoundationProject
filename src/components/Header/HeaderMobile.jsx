import React, { useContext, useRef, useState } from "react";
import classes from "./HeaderMobile.module.css";
import { createSearchParams, Link, useNavigate } from "react-router-dom";
import SearchContext from "../../context/headerContext";
import { useMediaQuery } from "react-responsive";
import { countFoodInCartList, getAccessToken, getToken } from "../../utils/util";
import { CartContext } from "../../context/cartContext";
import { TABLEURL } from "../../utils/const";
import { useQuery } from "@tanstack/react-query";
import { getTable } from "../../apis/tableApi";
import { toast } from "react-toastify";
import { FavContext } from "../../context/favContext";
import { fetchFavList } from "../../apis/fav.api";

export default function HeaderMobile({ configImg, title }) {
  const { tableId, cartList, userId } = useContext(CartContext);
  let favList = [];
  const token = getToken();
  const { favList: favListContext } = useContext(FavContext);
  const { isSearching, setIsSearching } = useContext(SearchContext);
  const { isMenuOpen, setIsMenuOpen } = useContext(SearchContext);
  const [searchKeyWord, setSearchKeyWord] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const isDesktop = useMediaQuery({ minWidth: 1024 });
  // const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isMobile = useMediaQuery({ maxWidth: 1023 });

  const isUsingTableAndLogin = tableId && getAccessToken();
  const isUsingTableAndNotLogin = tableId && !getAccessToken();
  const isNotUsingTableAndLogin = !tableId && getAccessToken();
  const isNotUsingTableAndNotLogin = !tableId && !getAccessToken();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["table", tableId],
    queryFn: () => getTable(tableId),
    enabled: Boolean(tableId),
  });

  let dataTable = [];

  if (data) {
    dataTable = data.data.data.pageContent;
  }

  const handleSearchClick = () => {
    setIsSearching(() => {
      inputRef.current.focus();
      return true;
    });
  };

  const handleBackSearch = () => {
    setIsSearching(false);
  };

  const handleOpenMenu = () => {
    setIsMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };
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

    setIsSearching(false);
    setSearchKeyWord("");
  };

  return (
    <div
      className={`${isMenuOpen ? classes["header-open-menu"] : classes.header} ${
        isDesktop && "px-20 py-1"
      } ${title === "cart" ? "relative border-b shadow-sm" : ""}`}
    >
      <div className={`${classes["header-logo"]}`}>
        <Link to={"/menu/all"}>
          <img
            className={configImg || ""}
            src="https://img.freepik.com/premium-vector/restaurant-logo-design_1128391-17280.jpg"
            alt="restaurant logo"
          />
        </Link>
      </div>

      {title ? <h3 className="absolute left-1/2 -translate-x-1/2 font-semibold">Ordering Cart</h3> : ""}

      {/* Chú thích:
      - Logo luôn hiện 
      - Nếu menu chưa open thì hiển thị đầy đủ mục ở header, nếu ngược lại thì không hiển thị, mà chỉ hiển thị close button thôi
      */}
      <ul className={`${classes.navbar}`}>
        {!isMenuOpen ? (
          <>
            {isMobile && title === "cart" ? (
              ""
            ) : (
              <>
                {isMobile && (
                  <div className={`${isSearching ? classes["header-search-open"] : classes["header-search"]}`}>
                    <form onSubmit={handleSubmit}>
                      <div className={`${isSearching ? classes.btnBack : classes.hidden}`}>
                        <button type="button" className={`button-click-expand`} onClick={handleBackSearch}>
                          <i className="fa fa-arrow-left"></i>
                        </button>
                      </div>
                      <input
                        ref={inputRef}
                        className={`${isSearching ? classes["search-open"] : classes["search-close"]}`}
                        type="text"
                        value={searchKeyWord}
                        onChange={handleChange}
                      />
                      <div className={`${isSearching ? classes["button-search-open"] : "hidden"}`}>
                        <button type="submit" className={`button-click-expand`}>
                          <i className="fa fa-search"></i>
                        </button>
                      </div>
                      <div className={`${!isSearching ? classes["button-search-open"] : "hidden"}`}>
                        <button type="button" className={`button-click-expand`} onClick={handleSearchClick}>
                          <i className="fa fa-search"></i>
                        </button>
                      </div>
                      {/* <div className={`${!isSearching ? classes["button-search-open"] : classes["button-search"]}`}>
                      <button className={`button-click-expand`} onClick={handleSearchClick}>
                        <i className="fa fa-search"></i>
                      </button>
                    </div> */}
                    </form>
                  </div>
                )}

                <div className={classes["header-auth"]}>
                  <Link to={"/userinfo"} className="text-black hover:!text-red-500">
                    <button className={`button-click-expand`}>
                      <i className="fa fa-user"></i>
                    </button>
                  </Link>
                </div>
                <div className={`${classes["header-fav"]} relative transition-all hover:text-red-600`}>
                  <Link to={"/fav"} className="text-black hover:!text-red-500">
                    <button className={`button-click-expand`}>
                      <i className="fa fa-heart"></i>
                    </button>
                    {favList.length > 0 && (
                      <span className="absolute -left-2 -top-2 flex size-3 items-center justify-center rounded-full bg-red-500 text-[9px] text-white">
                        {favList.length}
                      </span>
                    )}
                  </Link>
                </div>
                {isMobile && (
                  <>
                    <Link
                      to={`${tableId ? `${TABLEURL}${tableId}` : "/cart"}`}
                      className="fixed bottom-1/4 right-4 z-10"
                    >
                      <div
                        className={`${classes["header-cart"]} flex size-10 items-center justify-center rounded-full bg-red-500 text-sm text-white`}
                      >
                        {((cartList && cartList.length > 0) || (dataTable && dataTable.length > 0)) && (
                          <div className="absolute -right-[1px] -top-1 flex size-4 items-center justify-center rounded-full bg-blue-400">
                            {/* đếm số food đang ở trong table(giỏ hàng bằng cách fetch api gọi đến table, lấy số lượng rồi cho ra đây) */}

                            {dataTable.length > 0 && (
                              <span className="text-sm font-bold text-white">{dataTable.length}</span>
                            )}
                            {cartList.length > 0 && (
                              <span className="text-sm font-bold text-white">{cartList.length}</span>
                            )}

                            {/* <span className="text-sm font-bold text-white">2</span> */}
                          </div>
                        )}

                        <button className={`button-click-expand`}>
                          <i className="fa fa-shopping-cart"></i>
                        </button>
                      </div>
                    </Link>

                    <div>
                      <button className={`button-click-expand`} onClick={handleOpenMenu}>
                        <i className="fa fa-bars"></i>
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <div>
            <button className={`button-click-expand }`} onClick={handleCloseMenu}>
              <i className="fa fa-times"></i>
            </button>
          </div>
        )}
      </ul>
    </div>
  );
}
