import React, { useContext, useState } from "react";
import Modal from "../UI/Modal";
import { CartContext } from "../../context/cartContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orderFood } from "../../apis/tableApi";
import { getAccessToken, getUserIdLS, setUserIdToLS } from "../../utils/util";
import { toast } from "react-toastify";
import LoadingIndicator from "../UI/LoadingIndicator";
import { createPortal } from "react-dom";

export default function ModalOrdering({ title, modalId, size, triggeredButton, foodId, itemCart }) {
  const { tableId, addItemToCart, cartList, userId, setUserId } = useContext(CartContext);
  console.log("user id day", userId);
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  // const userId = getUserIdLS() || undefined;
  const isUsingTableAndLogin = tableId && getAccessToken();
  const isUsingTableAndNotLogin = tableId && !getAccessToken();
  const isNotUsingTableAndLogin = !tableId && getAccessToken();
  const isNotUsingTableAndNotLogin = !tableId && !getAccessToken();
  const cartId = localStorage.getItem("cartId");

  const handleDecre = (Car) => {
    if (quantity === 1) {
      return;
    } else {
      setQuantity((prevQuantity) => Number(prevQuantity) - 1);
    }
  };

  const handleIncre = () => {
    setQuantity((prevQuantity) => Number(prevQuantity) + 1);
  };

  const handleCancel = () => {
    setQuantity(1);
  };

  // mutation order food ở table, điện thoại
  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      console.log("userid o trong mutate gui len api", userId);
      return orderFood({
        quantity: Number(quantity),
        userId: userId,
        dishId: foodId,
        positionId: tableId || undefined,
        //Tí thay userid bằng cartid
        cartId: !tableId && cartId ? cartId : undefined,
      });
    },

    onSuccess: (data) => {
      setQuantity(1);
      if (!userId) {
        const newUserId = data.data.data.user.userId;
        setUserId(newUserId);
        setUserIdToLS(newUserId);
      }
      console.log("data o dy", data.data.data.user.userId);
      queryClient.invalidateQueries({
        queryKey: ["table", tableId],
      });
    },
    onError: (err) => {
      toast.error(err);
      console.error("err", err);
      toast.error(`Order failed, ${err.response.data.message}`, { autoClose: 3000 });
    },
  });

  // dùng context API ở đây , gửi đồ ăn này lên cartList bên context
  const handleOrder = () => {
    if (isUsingTableAndNotLogin || isUsingTableAndLogin) {
      mutate();
    } else if (isNotUsingTableAndNotLogin) {
      addItemToCart({
        ...itemCart,
        quantity: quantity,
      });
      setQuantity(1);
    } else if (isNotUsingTableAndLogin) {
      // Gọi mutation add vào giỏ hàng
      mutate(undefined, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["cartAmount", userId],
          });
          toast.success("Đã thêm vào giỏ hàng", {
            position: "top-center",
          });
        },
      });
    }
  };

  if (isPending) {
    return createPortal(
      <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black/70">
        <div className="translate-x-[20px]">
          <LoadingIndicator />
        </div>
      </div>,
      document.querySelector("#root"),
    );
  }

  return (
    <Modal title={title} id={modalId} size={size} triggeredButton={triggeredButton}>
      <div className="flex items-baseline justify-center gap-4">
        <span
          onClick={handleDecre}
          className="inline-block size-6 cursor-pointer rounded-full border !border-emerald-300 text-center leading-4 transition hover:scale-105"
        >
          -
        </span>
        {/* <span className="w-1/2 border-b border-black text-center text-xl">{quantity}</span> */}
        <input
          value={quantity}
          type="number"
          onChange={(e) => {
            setQuantity(e.target.value);
          }}
          className="w-1/2 border-b border-black text-center text-xl [appearance:textfield] dark:border-white dark:bg-gray-800 dark:text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <span
          onClick={handleIncre}
          className="inline-block size-6 cursor-pointer rounded-full border !border-emerald-300 text-center leading-4 transition hover:scale-105"
        >
          +
        </span>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={handleCancel}
          className="rounded-xl bg-red-500 px-3 py-[7px] text-xl font-bold text-white hover:bg-red-400"
          data-bs-dismiss="modal"
        >
          Cancel
        </button>
        <button
          data-bs-dismiss="modal"
          onClick={handleOrder}
          className="rounded-xl bg-emerald-600 px-3 py-[7px] text-xl font-bold text-white hover:bg-emerald-800"
        >
          {tableId ? "Order" : "Add to cart"}
        </button>
      </div>
    </Modal>
  );
}
