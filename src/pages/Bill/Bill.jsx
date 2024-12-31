import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPaymentDetails } from "../../apis/order.api";

export default function Bill() {
  const { paymentId } = useParams();
  const navigate = useNavigate();

  const { data: paymentData, isLoading } = useQuery({
    queryKey: ["payment", paymentId],
    queryFn: () => fetchPaymentDetails(paymentId),
  });

  console.log("paymentData", paymentData);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const { data } = paymentData || {};
  const totalAmount = data?.orders?.reduce((sum, order) => sum + order.totalPrice, 0) || 0;

  return (
    <div className="mx-auto max-w-3xl rounded-lg bg-white p-4 shadow-lg sm:p-6">
      {/* Header */}
      <div className="mb-6 text-center sm:mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Payment Receipt</h1>
        <p className="text-gray-600">Payment ID: {data?.paymentId}</p>
      </div>

      {/* Customer Information */}
      <div className="mb-6 sm:mb-8">
        <h2 className="mb-4 text-lg font-semibold sm:text-xl">Customer Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p>
              <span className="font-medium">Name:</span> {data?.user?.firstName} {data?.user?.lastName}
            </p>
            <p>
              <span className="font-medium">Email:</span> {data?.user?.emailOrPhone}
            </p>
          </div>
          <div>
            <p>
              <span className="font-medium">Address:</span> {data?.user?.address}
            </p>
            <p>
              <span className="font-medium">Payment Method:</span> {data?.paymentMethod}
            </p>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="mb-6 sm:mb-8">
        <h2 className="mb-4 text-lg font-semibold sm:text-xl">Order Details</h2>
        <div className="rounded-lg border">
          <table className="min-w-full table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-[45%] px-2 py-2 text-left text-sm sm:px-4">Item</th>
                <th className="w-[15%] px-2 py-2 text-center text-sm sm:px-4">Quantity</th>
                <th className="w-[20%] px-2 py-2 text-center text-sm sm:px-4">Price</th>
                <th className="w-[20%] px-2 py-2 text-right text-sm sm:px-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {data?.orders?.map((order) => (
                <tr key={order.orderId} className="border-t">
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-2">
                      <img src={order.dish.image} alt={order.dish.dishName} className="h-8 w-8 rounded object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-medium">{order.dish.dishName}</p>
                        <p className="text-xs text-gray-600">Table: {order.position.positionName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-center text-sm">{order.quantity}</td>
                  <td className="px-2 py-2 text-center text-sm">${order.dish.price.toFixed(2)}</td>
                  <td className="px-2 py-2 text-right text-sm">${order.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between text-lg font-semibold sm:text-xl">
          <span>Total Amount:</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-gray-600 sm:mt-8">
        <p className="text-sm sm:text-base">Thank you for your order!</p>
        <p className="text-xs sm:text-sm">Please keep this receipt for your records.</p>
      </div>
      <button
        onClick={() => navigate("/menu")}
        className="mb-4 mt-4 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 sm:mb-6 sm:mt-6 sm:w-auto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2 h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </button>
    </div>
  );
}
