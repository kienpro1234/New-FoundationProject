import { http } from "../utils/http";

export const getCartList = (cartId, queryParams, pageSize) =>
  http.get(`orders/cart/${cartId}`, {
    params: {
      ...queryParams,
      pageSize: pageSize || 5,
    },
  });

export const deleteCartItem = (orderId) => http.delete(`orders/${orderId}`);

// ... existing code ...

export const updateCartItem = ({ orderId, data }) =>
  http.put(`orders/${orderId}`, {
    quantity: data.quantity,
    cartId: data.cartId,
    userId: data.userId,
    dishId: data.dishId,
  });

export const fetchCartAmount = (cartId) => http.get(`carts/${cartId}`);
