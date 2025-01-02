import React, { useContext } from "react";
import HeaderMobile from "../../components/Header/HeaderMobile";
import CartItem from "../../components/ShoppingCart/CartItem";

import FooterCopyright from "../../components/Footer/FooterCopyright";
import { calcTotalPrice, getToken } from "../../utils/util";
import { CartContext } from "../../context/cartContext";
import noCartImg from "../../assets/no-cart.jpg";
import { useMediaQuery } from "react-responsive";
import classNames from "classnames";
import { Navigate } from "react-router-dom";
import ReservationForm from "./ReservationForm.jsx/ReservationForm";
import { getCartList } from "../../apis/cart.api";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../../components/Pagination/Pagination";
import useQueryParams from "../../hooks/useQueryParams";
import { toast } from "react-toastify";

export default function ShoppingCart() {
  const cartId = localStorage.getItem("cartId");
  // const { cartList } = useContext(CartContext);
  // cart list bây giờ sẽ gọi api lấy từ server, vì chỉ đăng nhập mới dùng được tính năng shopping cart

  const queryParams = useQueryParams();
  console.log("query params", queryParams);
  const newQueryParams = {
    ...queryParams,
    pageNo: queryParams?.pageNo || 1,
  };
  const cartListQuery = useQuery({
    queryKey: ["cartList", newQueryParams],
    queryFn: () => getCartList(cartId, newQueryParams),
  });

  const cartListget100OrderQuery = useQuery({
    queryKey: ["cartList"],
    queryFn: () => getCartList(cartId, undefined, 100),
  });

  // console.log("cartListQuery", cartListQuery.data.data.data);
  let cartList = [];
  if (cartListQuery.data) {
    cartList = cartListQuery.data.data.data.pageContent;
  }

  let cartListget100Order = [];
  if (cartListget100OrderQuery.data) {
    cartListget100Order = cartListget100OrderQuery.data.data.data.pageContent;
  }

  const token = getToken();
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  // const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isMobile = useMediaQuery({ maxWidth: 1023 });
  // const {mutate, isPending} = useMutation({
  //   mutationFn:
  // })

  //mutation để giảm số lượng hàng trong giỏ hàng

  //mutation để tăng số lượng hàng trong giỏ hàng

  //mutation để xóa hàng trong giỏ hàng

  const handleConfirmOrder = () => {};

  if (!token) {
    alert("Vui lòng đăng nhập để xem giỏ hàng");
    return <Navigate to="/login" />;
  }

  if (cartListQuery.isError) {
    toast.error(`${cartListQuery.error.response?.data?.message}`, {
      position: "top-center",
      autoClose: 3000,
    });
  }

  return (
    <div className="min-h-screen">
      <HeaderMobile configImg={"!size-16 !rounded-full"} title={"cart"} />
      {cartListQuery.isFetching ? (
        <div className="mx-auto mt-9 grid max-w-7xl grid-cols-1 gap-9 px-4 md:grid-cols-2 md:gap-40">
          {/* Left side skeleton */}
          <div className="col-span-1">
            {/* Skeleton for cart items */}
            {[1, 2, 3].map((item) => (
              <div key={item} role="status" className="mb-6 flex animate-pulse space-x-4 rounded-xl border p-4">
                {/* Image skeleton */}
                <div className="h-24 w-24 rounded-lg bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-4">
                  {/* Title skeleton */}
                  <div className="h-4 w-3/4 rounded-full bg-gray-200 dark:bg-gray-700" />
                  {/* Price skeleton */}
                  <div className="h-3 w-1/4 rounded-full bg-gray-200 dark:bg-gray-700" />
                  {/* Quantity controls skeleton */}
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-24 rounded-lg bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right side skeleton */}
          <div className="col-span-1">
            <div role="status" className="animate-pulse rounded-xl border p-6">
              <div className="mb-6 space-y-4">
                <div className="h-4 w-full rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-3/4 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
              {/* Form fields skeleton */}
              {[1, 2, 3].map((item) => (
                <div key={item} className="mb-4 space-y-2">
                  <div className="h-3 w-1/4 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="h-10 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
                </div>
              ))}
              {/* Button skeleton */}
              <div className="mt-6 h-12 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      ) : (
        <>
          {!cartList || cartList.length === 0 ? (
            <div className="flex max-h-[491px] items-center justify-center">
              <img src={noCartImg} alt="no-cart-img" />
            </div>
          ) : (
            <div className="mx-auto mt-9 grid max-w-7xl grid-cols-1 gap-9 px-4 md:grid-cols-2 md:gap-40">
              {/* left side */}
              <div className="col-span-1 flex flex-col gap-3">
                {(!cartList || cartList.length === 0) && (
                  <div className="text-lg text-red-500">Chưa có gì trong giỏ hàng</div>
                )}
                {cartList && cartList.length > 0 && cartList.map((item) => <CartItem key={item.orderId} food={item} />)}
                <Pagination
                  totalPages={cartListQuery.data.data.data.totalPages}
                  queryParams={queryParams}
                  pathname={"/cart"}
                />
              </div>

              {/* right side */}
              <div className="col-span-1">
                <ReservationForm cartItems={cartListget100Order} />
              </div>
            </div>
          )}
        </>
      )}

      <FooterCopyright
        title={"cart"}
        // footerClassName={classNames("", {
        //   "absolute left-0 right-0 bottom-0": isDesktop,
        // })}
      />
    </div>
  );
}

//Phần bỏ đi của right side

{
  /* <div className="flex justify-between">
              <p>Total</p>
              <p>${calcTotalPrice(cartList)}</p>
            </div> */
}

{
  /* <div className="flex justify-between my-8">
              <p>Delivery Fee</p>
              <p>$29</p>
            </div>
            <div className="flex justify-between">
              <p>Grand Total</p>
              <p>$29</p>
            </div> */
}
{
  /* <div className="mt-8 text-center">
              <button
                onClick={handleConfirmOrder}
                className="rounded-3xl bg-[hsl(0,96.78%,49.94%,0.6)] px-4 py-2 text-white hover:bg-[hsl(0,96.78%,49.94%,0.8)]"
              >
                Confirm Order

              </button>
            </div> */
}
