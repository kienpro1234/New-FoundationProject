import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/cartContext";

export default function CartItem({ food }) {
  const { increaseItem, decreaseItem } = useContext(CartContext);

  return (
    <div className="p-2 shadow-1">
      {/* CONTAINER */}
      <div className="grid grid-cols-8 gap-1 bmd:grid-cols-7 md:grid-cols-8">
        {/* image */}
        <div className="col-span-2 flex justify-center bmd:col-span-1 md:col-span-2">
          <div className="bg-gray-400 p-1">
            <Link to={`/food/${food.id}`}>
              <img src={food.image} alt="" className="size-[70px]" />
            </Link>
          </div>
        </div>

        {/* CONTENT */}
        <div className="col-span-6 flex justify-between bmd:col-span-6 md:col-span-6">
          {/* left side */}
          <div className="overflow-hidden">
            <h3 className="mb-1 truncate text-lg font-bold">{food.dishName}</h3>
            <p className="text-sm">Portion: {food.portion}</p>
            <p className="text-sm">Price: ${food.price}</p>
          </div>
          <div className="flex flex-shrink-0 flex-col justify-between">
            <div className="mr-[3px] cursor-pointer text-right">
              <i className="fa fa-times"></i>
            </div>
            <div>
              <span
                onClick={() => decreaseItem(food)}
                className="inline-block size-4 cursor-pointer rounded-full border !border-emerald-300 text-center leading-[10px] transition hover:scale-105"
              >
                -
              </span>
              <span className="px-1">{food.quantity}</span>
              <span
                onClick={() => increaseItem(food)}
                className="inline-block size-4 cursor-pointer rounded-full border !border-emerald-300 text-center leading-[10px] transition hover:scale-105"
              >
                +
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
