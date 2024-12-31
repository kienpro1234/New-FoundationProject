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

export default function ShoppingCart() {
  // const { cartList } = useContext(CartContext);
  // cart list bây giờ sẽ gọi api lấy từ server, vì chỉ đăng nhập mới dùng được tính năng shopping cart
  const dummyCartList = [
    {
      id: 1,
      name: "Spicy Seasoned Seafood Noodles",
      price: 2.29,
      image: "https://source.unsplash.com/random/200x200/?noodles",
      quantity: 2,
    },
    {
      id: 2,
      name: "Salted Pasta with mushroom sauce",
      price: 2.69,
      image: "https://source.unsplash.com/random/200x200/?pasta",
      quantity: 1,
    },
    {
      id: 3,
      name: "Beef dumpling in hot soup",
      price: 2.99,
      image: "https://source.unsplash.com/random/200x200/?dumpling",
      quantity: 3,
    },
  ];

  const cartList = dummyCartList;

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

  return (
    <div className="min-h-screen">
      <HeaderMobile configImg={"!size-16 !rounded-full"} title={"cart"} />

      {!cartList || cartList.length === 0 ? (
        <div className="flex max-h-[467px] items-center justify-center">
          <img src={noCartImg} alt="no-cart-img" />
        </div>
      ) : (
        <div className="mx-auto mt-9 grid max-w-7xl grid-cols-1 gap-9 px-4 md:grid-cols-2 md:gap-40">
          {/* left side */}
          <div className="col-span-1 flex flex-col gap-3">
            {(!cartList || cartList.length === 0) && (
              <div className="text-lg text-red-500">Chưa có gì trong giỏ hàng</div>
            )}
            {cartList && cartList.length > 0 && cartList.map((item) => <CartItem key={item.id} food={item} />)}
          </div>

          {/* right side */}
          <div className="col-span-1">
            <ReservationForm cartItems={cartList} />
          </div>
        </div>
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
