import { http } from "../utils/http";

export const fetchOrderList = (userId, queryParams) =>
  http.get(`orders/user/${userId}`, {
    params: {
      ...queryParams,
      pageSize: 4,
    },
  });

export const rateOrder = (data) => http.post("rankings", data);

export const fetchPaymentDetails = async (paymentId) => {
  const response = await http.get(`payments/${paymentId}`);
  return response.data;
};

export const updateOrderStatus = ({ orderId, orderStatus }) =>
  http.patch(`orders/${orderId}/update-order-status?status=${orderStatus}`);
