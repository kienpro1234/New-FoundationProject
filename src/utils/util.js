import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

// export const formatPriceUSD = (price) => {
//   if (typeof price !== 'number' || isNaN(price)) {
//     return 'Invalid price'; // Hoặc bạn có thể đưa ra một thông báo phù hợp
//   }
//   return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
// };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);

export const formatName = (name) => {
  // Chuyển tất cả thành chữ thường và tách từ dấu gạch nối nếu có
  const words = name.toLowerCase().split("-");

  // Viết hoa chữ cái đầu của từng từ, chỉ áp dụng cho từ đầu tiên
  const formattedWords = words.map((word, index) => {
    if (index === 0) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word;
  });

  // Kết hợp các từ lại với dấu cách
  return formattedWords.join(" ");
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

//get accees token
export const getToken = () => {
  return localStorage.getItem("accessToken") || null;
};

export const getUserIdLS = () => {
  return localStorage.getItem("userId") || null;
};

export const setUserIdToLS = (userId) => {
  localStorage.setItem("userId", userId);
};

export const getRoleLS = () => {
  return localStorage.getItem("role") || null;
};

export const setCartListToLS = (cartList) => {
  localStorage.setItem("cartList", JSON.stringify(cartList));
};

export const getCartListFromLS = () => {
  return JSON.parse(localStorage.getItem("cartList")) || [];
};

export const getUserFromLS = () => {
  return JSON.parse(localStorage.getItem("user")) || null;
};

export const getEmailOrPhoneReconfirmFromLS = () => {
  return localStorage.getItem("emailOrPhoneReconfirm") || null;
};

export const setEmailOrPhoneReconfirmToLS = (emailOrPhoneReconfirm) => {
  localStorage.setItem("emailOrPhoneReconfirm", emailOrPhoneReconfirm);
};

export const isEmail = (email) => {
  const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  if (emailRegex.test(email)) {
    return true;
  } else {
    return false;
  }
};

export const calcTotalPrice = (cartList) => {
  const total = cartList.reduce((acc, food) => (acc += Number(food.price) * Number(food.quantity)), 0);

  return parseFloat(total.toFixed(2));
};

export const countFoodInCartList = (cartList) => {
  return cartList.reduce((acc) => acc + 1, 0);
};

export const isPhoneNumber = (phoneNumber) => {
  const phoneNumberRegex = /^\d+$/;
  if (phoneNumberRegex.test(phoneNumber)) {
    return true;
  } else {
    return false;
  }
};

export const transformCategoryNameToURL = (categoryName) => {
  return categoryName.replace(" ", "%20").toLowerCase().trim();
};

export const formatVietnamCurrency = (amount) => {
  return (
    new Intl.NumberFormat("vi-VN", {
      style: "decimal",
    }).format(amount) + "đ"
  );
};

export function normalizeNumber(number) {
  if (Number.isInteger(number)) {
    return number;
  }
  const integerPart = Math.floor(number);
  const decimalPart = number - integerPart;
  if (decimalPart === 0) {
    return integerPart;
  }
  return number;
}
