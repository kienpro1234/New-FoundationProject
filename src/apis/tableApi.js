import { DOMAIN } from "../utils/const";
import { http } from "../utils/http";

export const getTable = (tableId) => http.get(`orders/position/${tableId}`);

// export const confirmOrderToTable = () => http.post(``)

// const URL_ORDER_FOOD =
export const orderFood = (data) => http.post("orders", data);

export const deleteOrder = (orderId) => http.delete(`orders/${orderId}`);

export const payOrders = (data) => http.post("payments/vn-pay", data);
