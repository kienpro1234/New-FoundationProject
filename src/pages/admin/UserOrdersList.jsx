import React from "react";
import { useQuery } from "@tanstack/react-query";
import { http } from "../../utils/http";
import LoadingIndicator from "../../components/UI/LoadingIndicator";
import { createPortal } from "react-dom";

export default function UserOrdersList({ userId, onClose }) {
  console.log("userid usorderlist", userId);
  const { data: orders, isLoading } = useQuery({
    queryKey: ["userOrders", userId],
    queryFn: async () => {
      const response = await http.get(`orders/user/${userId}`);
      return response.data;
    },
  });

  if (isLoading) {
    return createPortal(
      <div className="fixed inset-0 z-50 bg-black/40">
        <div className="relative"></div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <LoadingIndicator />
        </div>
      </div>,
      document.querySelector("#root"),
    );
  }

  const orderList = orders?.data?.pageContent || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[80vh] w-[80%] overflow-y-auto rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">User Orders</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Dish</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Total Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Position</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orderList.map((order) => (
                <tr key={order.orderId}>
                  <td className="whitespace-nowrap px-6 py-4">{order.orderId}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img src={order.dish.image} alt={order.dish.dishName} className="mr-2 h-10 w-10 rounded-full" />
                      <div>
                        <div className="font-medium">{order.dish.dishName}</div>
                        <div className="text-sm text-gray-500">${order.dish.price}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{order.quantity}</td>
                  <td className="whitespace-nowrap px-6 py-4">${order.totalPrice}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${order.status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      {order.status ? "Đã thanh toán" : "Chưa thanh toán"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{order.position.positionName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
