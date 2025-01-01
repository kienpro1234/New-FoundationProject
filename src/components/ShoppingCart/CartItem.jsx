import React, { useContext, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/cartContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCartItem, updateCartItem } from "../../apis/cart.api";
import LoadingModal from "../LoadingModal/LoadingModal";
import { toast } from "react-toastify";

export default function CartItem({ food }) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(food.quantity);
  const buttonClickedRef = useRef(false);

  const deleteMutation = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      // Invalidate and refetch cart data
      toast.success("Xóa thành công!");
      queryClient.invalidateQueries({ queryKey: ["cartList"] });
    },
    onError: (error) => {
      console.error("Error deleting item:", error);
      toast.error("Xóa thất bại!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartList"] });
      toast.success("Cập nhật thành công!");
    },
    onError: (error) => {
      console.error("Error updating item:", error);
      toast.error("Cập nhật thất bại!");
    },
  });

  const updateItem = (food, increment = true) => {
    console.log("foood", food);
    const newQuantity = increment ? food.quantity + 1 : food.quantity - 1;

    // Không cho phép số lượng nhỏ hơn 1
    if (newQuantity < 1) return;
    const data = {
      orderId: food.orderId,
      quantity: newQuantity,
      cartId: food.cartId,
      userId: food.userId,
      dishId: food.dish.id,
    };
    updateMutation.mutate({ orderId: food.orderId, data });
  };

  const handleQuantitySubmit = async (e) => {
    // Thêm một khoảng delay nhỏ để đảm bảo isEditing được cập nhật đúng
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (buttonClickedRef.current) {
      buttonClickedRef.current = false;
      setIsEditing(false);
      return;
    }

    const newQuantity = parseInt(inputValue);
    if (isNaN(newQuantity) || newQuantity < 1) {
      toast.error("Số lượng không hợp lệ!");
      setInputValue(food.quantity);
      setIsEditing(false);
      return;
    }

    if (newQuantity === food.quantity) {
      setIsEditing(false);
      return;
    }

    const data = {
      orderId: food.orderId,
      quantity: newQuantity,
      cartId: food.cartId,
      userId: food.userId,
      dishId: food.dish.id,
    };
    await updateMutation.mutateAsync({ orderId: food.orderId, data });
    setIsEditing(false);
  };

  return (
    <div className="p-2 shadow-1">
      {(deleteMutation.isPending || updateMutation.isPending) && <LoadingModal className="translate-x-0" />}
      {/* CONTAINER */}
      <div className="grid grid-cols-8 gap-1 bmd:grid-cols-7 md:grid-cols-8">
        {/* image */}
        <div className="col-span-2 flex justify-center bmd:col-span-1 md:col-span-2">
          <div className="bg-gray-400 p-1">
            <Link to={`/food/${food.orderId}`}>
              <img src={food.dish.image} alt={food.dish.dishName} className="size-[70px]" />
            </Link>
          </div>
        </div>

        {/* CONTENT */}
        <div className="col-span-6 flex justify-between bmd:col-span-6 md:col-span-6">
          {/* left side */}
          <div className="overflow-hidden">
            <h3 className="mb-1 truncate text-lg font-bold">{food.dish.dishName}</h3>
            <p className="text-sm">Portion: {food.dish.portion}</p>
            <p className="text-sm">Price: ${food.dish.price}</p>
          </div>
          <div className="flex flex-shrink-0 flex-col justify-between">
            <div className="mr-[3px] cursor-pointer text-right" onClick={() => deleteMutation.mutate(food.orderId)}>
              <i className="fa fa-times"></i>
            </div>
            <div>
              <button
                type="button"
                disabled={isEditing}
                onMouseDown={() => (buttonClickedRef.current = true)}
                onClick={() => {
                  if (isEditing) return;
                  updateItem(food, false);
                }}
                className={`inline-block size-4 cursor-pointer rounded-full border !border-emerald-300 text-center leading-[10px] transition ${
                  isEditing ? "!cursor-not-allowed opacity-50" : "hover:scale-105"
                }`}
              >
                -
              </button>
              {isEditing ? (
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onBlur={handleQuantitySubmit}
                  onKeyDown={(e) => e.key === "Enter" && handleQuantitySubmit()}
                  className="w-12 rounded border border-emerald-300 px-1 text-center outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  autoFocus
                />
              ) : (
                <span className="cursor-pointer px-1 hover:text-emerald-500" onClick={() => setIsEditing(true)}>
                  {food.quantity}
                </span>
              )}
              <button
                type="button"
                disabled={isEditing}
                onMouseDown={() => (buttonClickedRef.current = true)}
                onClick={() => {
                  if (isEditing) return;
                  updateItem(food, true);
                }}
                className={`inline-block size-4 cursor-pointer rounded-full border !border-emerald-300 text-center leading-[10px] transition ${
                  isEditing ? "!cursor-not-allowed opacity-50" : "hover:scale-105"
                }`}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
