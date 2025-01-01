import { useMutation } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { payOrders } from "../../../apis/tableApi";

import { CartContext } from "../../../context/cartContext";
import LoadingModal from "../../../components/LoadingModal/LoadingModal";

export default function PopUpReservation({ handleClose, reservationData, cartItems }) {
  console.log("cart items:", cartItems);
  console.log("reservationData:", reservationData);
  const { userId } = useContext(CartContext);
  // Add state for confirmation popup
  const [showConfirmation, setShowConfirmation] = useState(false);

  const cartOrderIdList = cartItems.map((order) => order.orderId);
  console.log("cartOrderIdList:", cartOrderIdList);

  const paymentMutation = useMutation({
    mutationFn: (data) => payOrders(data),
    onSuccess: (data) => {
      console.log("payment response data", data);
      const paymentUrl = data.data.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
    },
    onError: (err) => {
      console.error("err payment", err);
    },
  });

  const handlePayment = () => {
    if (cartOrderIdList.length > 0) {
      paymentMutation.mutate({
        paymentMethod: "Vn-Pay",
        userId: userId,
        orderIds: [...cartOrderIdList],
      });
    } else {
      toast.warning("Hiện không có order nào để thanh toán", {
        position: "top-center",
      });
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {paymentMutation.isPending && <LoadingModal className="translate-x-0" />}
      <div className="w-11/12 max-w-4xl rounded-lg bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">Reservation Details</h2>
        <div className="mb-6 grid grid-cols-2 gap-6">
          <div>
            <span className="block text-sm font-medium text-gray-700">Name</span>
            <p className="mt-1 text-sm text-gray-900">{reservationData.name}</p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700">Phone Number</span>
            <p className="mt-1 text-sm text-gray-900">{reservationData.phone}</p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700">Date & Time</span>
            <p className="mt-1 text-sm text-gray-900">
              {reservationData.date && reservationData.time
                ? new Date(`${reservationData.date}T${reservationData.time}`).toLocaleString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "No date selected"}
            </p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700">Number of Tables</span>
            <p className="mt-1 text-sm text-gray-900">{reservationData.tables}</p>
          </div>
        </div>

        <div className="mb-6">
          <span className="block text-base font-medium text-gray-700">Ordered Dishes</span>
          <div className="mt-3 h-64 overflow-y-auto rounded-md border border-gray-300 p-4">
            {cartItems.map((item, index) => (
              <div key={index} className="mb-2 flex justify-between p-2 hover:bg-gray-100">
                <span>{item.dish.dishName}</span>
                <span>{item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowConfirmation(true)}
            type="button"
            className="rounded-md bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Xác nhận
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Đóng
          </button>
        </div>
        {/* Add confirmation popup */}
        {showConfirmation && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-[28rem] rounded-lg bg-white p-8 shadow-xl">
              <h3 className="mb-6 text-xl font-semibold">Confirm Payment</h3>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handlePayment}
                  className="rounded-md bg-green-600 px-4 py-2 text-white shadow hover:bg-green-700"
                >
                  Pay
                </button>
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="rounded-md bg-gray-600 px-4 py-2 text-white shadow hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
