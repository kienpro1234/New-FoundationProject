import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoadingIndicator from "../UI/LoadingIndicator";
import Modal from "../UI/Modal";
import RatingForm from "../RatingForm/RatingForm";

export default function UserOrderList({ orderList, loadingOrderList }) {
  console.log("trang thai load", loadingOrderList);

  if (loadingOrderList) {
    return <LoadingIndicator />;
  }
  return (
    <div>
      <h2 className="mt-3 text-3xl font-semibold underline underline-offset-2 hover:text-orange-700">Order List</h2>

      {orderList.length > 0 &&
        orderList.map((order) => {
          return (
            <div key={order.orderId} className="mt-3 space-y-4">
              {/* content */}
              {/* item */}
              <div className="bg-white px-9 py-3 ps-4 shadow-orderItem">
                <div className="flex items-center justify-between">
                  {/* image */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 bg-gray-400 p-1">
                      <Link to={`/food/${order.dish.dishId}`}>
                        <img src={order.dish.image} alt="img" className="size-[70px] object-cover" />
                      </Link>
                    </div>
                    <div className="md:overflow-hidden">
                      <h3 className="mb-1 text-nowrap text-sm font-bold md:text-lg">{order.dish.dishName}</h3>
                      <p className="text-sm">Portion: {order.dish.portion}</p>
                      <p className="text-sm">Price: {order.dish.price}</p>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="">
                    {/* left side */}

                    <div className="">
                      <div className="mr-[3px] text-right text-xl">${order.dish.price}</div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  {order?.ratingStatus && (
                    <Link to={`/food/${order.dish.dishId}`}>
                      <button className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300 dark:focus:ring-orange-900">
                        Mua lại{" "}
                      </button>
                    </Link>
                  )}
                  {!order?.ratingStatus && (
                    <Modal
                      classNameTitle={"text-2xl"}
                      title="Đánh giá món ăn"
                      id={`rating_food${order.orderId}`}
                      size="lg" // md, sm, lg, xl
                      triggeredButton={
                        <button className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300 dark:focus:ring-orange-900">
                          Đánh giá{" "}
                        </button>
                      }
                    >
                      {/* Nội dung bên trong modal */}
                      {/* component form sẽ thêm ở đây  */}
                      <RatingForm order={order} />
                    </Modal>
                  )}
                </div>
              </div>
            </div>
          );
        })}

      {orderList.length === 0 && !loadingOrderList && (
        <p className="text-center font-yummy text-xl text-red-500">Không có đơn hàng nào</p>
      )}
    </div>
  );
}
