import { createContext, useReducer } from "react";
import { toast } from "react-toastify";

export const FavContext = createContext({
  favList: [],
  removeItemFromFav: () => null,
  addItemToFav: () => null,
});

const getFavListFromLS = () => {
  return JSON.parse(localStorage.getItem("favList")) || [];
};

const setFavListToLS = (favList) => {
  localStorage.setItem("favList", JSON.stringify(favList));
};

const intitialState = {
  favList: getFavListFromLS(),
};

// Cũng giống cartReducer , dành cho ng chưa đăng nhập, thực hiện lưu dưới client, và LS
const favReducer = (state, action) => {
  switch (action.type) {
    case "REMOVE_ITEM_FROM_FAV": {
      console.log("vao day");
      const favList = [...state.favList].filter((item) => item.dishId !== action.itemId);
      setFavListToLS(favList);
      console.log("fav list nuc nay", favList);
      return {
        ...state,
        favList,
      };
    }

    case "ADD_ITEM_TO_FAV": {
      console.log("action.item", action.item);
      const favList = [...state.favList];
      console.log("favList", favList);
      console.log("action.item", action?.item?.dishId);
      const item = favList.find((item) => {
        console.log("itemId", item.dishId);
        console.log("action.item.id", action.item.dishId);
        return action.item.dishId === item.dishId;
      });
      console.log("item", item);
      if (item) {
        toast.warning("Thức ăn này đã có trong danh sách yêu thích của bạn", { position: "top-center" });
      } else {
        favList.push(action.item);
        setFavListToLS(favList);
        toast.success("Đã thêm vào danh sách món ăn yêu thích", { position: "top-center" });
      }

      // setCartListToLS(cartList);
      return {
        ...state,
        favList,
      };
    }
  }
};

export default function FavContextProvider({ children }) {
  const [stateFav, dispatch] = useReducer(favReducer, intitialState);

  const removeItemFromFav = (itemId) => {
    dispatch({
      type: "REMOVE_ITEM_FROM_FAV",
      itemId,
    });
  };

  const addItemToFav = (item) => {
    console.log("qua den context");
    dispatch({
      type: "ADD_ITEM_TO_FAV",
      item,
    });
  };
  return (
    <FavContext.Provider
      value={{
        favList: stateFav.favList,
        removeItemFromFav,
        addItemToFav,
      }}
    >
      {children}
    </FavContext.Provider>
  );
}
