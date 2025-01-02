import { useQuery } from "@tanstack/react-query";

import { http } from "../../utils/http";
import AdminNavbar from "./AdminNavbar";
import { useState } from "react";
import UserInfoModal from "./UserInfoModal";
import { formatVietnamCurrency } from "../../utils/util";
import PaymentBill from "./PaymentBill";

const fetchPayments = async () => {
  const response = await http.get("payments");
  return response.data.data;
};

const PaymentsList = () => {
  const [selectedOrdersPayment, setSelectedOrdersPayment] = useState(null);
  const [selectedUserForInfo, setSelectedUserForInfo] = useState(null);
  const {
    data: paymentsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["payments"],
    queryFn: fetchPayments,
  });
  if (paymentsData) {
    console.log("paysmentsData", paymentsData);
  }

  if (isLoading) return <div className="!ml-[250px] p-6">Loading...</div>;
  if (isError) return <div className="!ml-[250px] p-6 text-red-500">{error.message}</div>;

  const payments = paymentsData.pageContent;

  return (
    <div>
      <AdminNavbar />
      {selectedUserForInfo && (
        <UserInfoModal userId={selectedUserForInfo} onClose={() => setSelectedUserForInfo(null)} />
      )}

      {selectedOrdersPayment && (
        <PaymentBill orders={selectedOrdersPayment} onClose={() => setSelectedOrdersPayment(null)} />
      )}
      <div className="!ml-[240px] px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">User Payments</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full rounded-lg bg-white shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="w-fit px-6 py-3 pr-0 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Payment ID
                </th>
                <th className="w-fit px-6 py-3 pr-0 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  User
                </th>
                <th className="w-fit px-6 py-3 pr-0 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Method
                </th>
                <th className="w-fit px-6 py-3 pr-0 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Amount
                </th>
                <th className="w-fit px-6 py-3 pr-0 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Email
                </th>
                <th className="w-fit px-6 py-3 pr-0 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Bill
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.paymentId} className="hover:bg-gray-50">
                  <td className="w-fit whitespace-nowrap px-6 py-4">{payment.paymentId}</td>
                  <td className="w-fit whitespace-nowrap px-6 py-4">
                    <div
                      className="flex cursor-pointer items-center text-blue-600 hover:text-blue-900"
                      onClick={() => setSelectedUserForInfo(payment.user.userId)}
                    >
                      <img
                        src={payment.user.imageUrl}
                        alt={`${payment.user.firstName} ${payment.user.lastName}`}
                        className="mr-3 h-8 w-8 rounded-full"
                      />
                      <span>
                        {payment.user.firstName} {payment.user.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="w-fit whitespace-nowrap px-6 py-4">{payment.paymentMethod}</td>
                  <td className="w-fit whitespace-nowrap px-6 py-4">{formatVietnamCurrency(payment.amount)}</td>
                  <td className="w-fit whitespace-nowrap px-6 py-4">{payment.user.emailOrPhone}</td>
                  <td
                    className="w-fit cursor-pointer whitespace-nowrap px-6 py-4 text-blue-400 hover:text-blue-500"
                    onClick={() => setSelectedOrdersPayment(payment.orders)}
                  >
                    Click to see bill
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentsList;
