import { createContext, useEffect, useReducer, useState } from "react";
import { getCartListFromLS, getToken, setCartListToLS } from "../utils/util";
import { io } from "socket.io-client";

export const CartContext = createContext({
  //state để xử lý data cart khi người dùng chưa đăng nhập
  cartList: [],
  increaseItem: () => {},
  decreaseItem: () => {},
  addItemToCart: () => {},

  userId: "",
  setUserId: () => "",
  tableId: "",
  setTableId: () => {},
  socket: undefined,
  setSocket: (socket) => {},
});

const intitialState = {
  cartList: [],
  userId: localStorage.getItem("userId") || "",
};

// Dùng cho tăng giảm trong cart , chứ không phải cho sau khi click vào nút order

//Chức năng dành cho người chưa đăng nhập, sẽ xử lý ở local state và lưu data ở LS
const cartReducer = (state, action) => {
  switch (action.type) {
    case "INCREASE_ITEM": {
      const cartList = [...state.cartList];
      console.log("cafda", cartList);
      const item = cartList.find((item) => action.item.dishId === item.dishId);
      if (item) {
        item.quantity++;
      } else {
        cartList.push(action.item);
      }

      // setCartListToLS(cartList);
      return {
        ...state,
        cartList,
      };
    }
    case "DECREASE_ITEM": {
      const cartList = [...state.cartList];
      const index = cartList.findIndex((item) => action.item.dishId === item.dishId);
      if (index !== -1) {
        if (cartList[index].quantity > 1) {
          cartList[index].quantity--;
        } else {
          cartList.splice(index, 1);
        }
      }

      // setCartListToLS(cartList);
      return {
        ...state,
        cartList,
      };
    }

    case "ADD_ITEM_TO_CART": {
      console.log("qua den switch case add to cart");
      console.log("action.item", action.item);
      const cartList = [...state.cartList];
      console.log("cartList", cartList);
      console.log("action.item", action.item.dishId);
      const item = cartList.find((item) => {
        console.log("itemId", item.dishId);
        console.log("action.item.id", action.item.dishId);
        return action.item.dishId === item.dishId;
      });
      console.log("item", item);
      if (item) {
        item.quantity += action.item.quantity;
      } else {
        cartList.push(action.item);
      }

      // setCartListToLS(cartList);
      return {
        ...state,
        cartList,
      };
    }
  }
};

//Có thể dùng kết hợp useReducer sau, hỏi để tối ưu đoạn này thay vì dùng useState để code state có logic lớn
export const CartContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(undefined);
  const [state, dispatch] = useReducer(cartReducer, intitialState);
  const [tableId, setTableId] = useState("");
  const [userId, setUserId] = useState(intitialState.userId);
  const token = getToken();

  // useEffect(() => {
  //   if (token) {
  //     setSocket(
  //       io("http://localhost:3001", {
  //         auth: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }),
  //     );
  //   }
  // }, []);

  console.log("userId o ben nay ntn", userId);
  // 3 function này để xử lý cart khi người dùng chưa đăng nhập, lưu vào LS

  const increaseItem = (item) => {
    dispatch({
      type: "INCREASE_ITEM",
      item,
    });
  };

  const decreaseItem = (item) => {
    dispatch({
      type: "DECREASE_ITEM",
      item,
    });
  };

  const addItemToCart = (item) => {
    console.log("qua den context");
    dispatch({
      type: "ADD_ITEM_TO_CART",
      item,
    });
  };
  return (
    // <CartContext.Provider value={{ cartList: state.cartList, increaseItem, decreaseItem, addItemToCart }}>
    <CartContext.Provider
      value={{
        tableId,
        setTableId,
        cartList: state.cartList,
        increaseItem,
        decreaseItem,
        addItemToCart,
        userId,
        setUserId,
        socket,
        setSocket,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
