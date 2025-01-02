import React from "react";

export default function PaymentBill({ orders, onClose }) {
  let total = 0;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[80vh] w-[80%] overflow-y-auto rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold">Payment bill</h3>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.map((order) => {
                total += order.totalPrice;
                return (
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
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>
                  <div className="translate-x-[86px] text-right">Total: ${total.toFixed(2)}</div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
