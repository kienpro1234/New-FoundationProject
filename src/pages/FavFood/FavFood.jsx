import React, { useContext, useEffect } from "react";
import MenuLanding from "../../components/Menu/MenuLanding";
import Footer from "../../components/Footer/Footer";
import { Link } from "react-router-dom";
import { FavContext } from "../../context/favContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { deleteFavFood, fetchFavList } from "../../apis/fav.api";
import { CartContext } from "../../context/cartContext";
import { getAccessToken } from "../../utils/util";
import LoadingModal from "../../components/LoadingModal/LoadingModal";
import { toast } from "react-toastify";

export default function FavFood() {
  // Lấy FavList từ context đối với người dùng chưa đăng nhập
  const token = getAccessToken();
  console.log("Token fucking ken", token);
  let favList = [];
  const { favList: favListContext, removeItemFromFav } = useContext(FavContext);
  const { userId } = useContext(CartContext);

  const getFavQuery = useQuery({
    queryKey: ["favList", userId],
    queryFn: () => fetchFavList(userId),
    enabled: Boolean(token),
  });

  // if (getFavQuery.data) {
  //   favList = getFavQuery.data.data.data.pageContent;
  // }

  const deleteFavMutation = useMutation({
    mutationFn: deleteFavFood,
    onSuccess: () => {
      toast.success("Xóa thành công");
      getFavQuery.refetch();
    },
    onError: () => {
      toast.error("Xóa thất bại");
    },
  });
  const handleDeleteFavFood = (id) => () => {
    if (!token) {
      console.log("vao day rr");
      removeItemFromFav(id);
    } else {
      deleteFavMutation.mutate(id);
    }
  };

  if (!token) {
    favList = favListContext;
  } else {
    if (getFavQuery.data) {
      favList = getFavQuery.data.data.data.pageContent;
    }
  }

  console.log("favList", favList);
  return (
    <div className="menu">
      <MenuLanding favPage={"FAV_PAGE"} />
      {(getFavQuery.isLoading || deleteFavMutation.isPending) && <LoadingModal />}
      <div className="bg-slate-100 py-11">
        {favList.length > 0 &&
          favList.map((favFood) => {
            let food = null;
            if (token) {
              food = favFood.dish;
            } else {
              food = favFood;
            }
            return (
              <div key={food.dishId} className="mx-auto max-w-4xl p-3">
                <div className="bg-white px-9 py-3 ps-4 shadow-1">
                  {/* CONTAINER */}
                  <div className="flex items-center justify-between">
                    {/* image */}
                    <div className="flex gap-3">
                      <div className="bg-gray-400 p-1">
                        <Link to={`/food/${food.dishId}`}>
                          <img src={food.image} alt="img" className="size-[70px]" />
                        </Link>
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="mb-1 truncate text-lg font-bold">{food.dishName}</h3>
                        <p className="text-sm">Portion: {food.portion}</p>
                        <p className="text-sm">Price: {food.price}</p>
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="">
                      {/* left side */}

                      <div className="">
                        <div
                          className="mr-[3px] cursor-pointer text-right"
                          onClick={handleDeleteFavFood(!token ? food.dishId : favFood.favoriteId)}
                        >
                          <i className="fa fa-times"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        {favList.length === 0 && !getFavQuery.isLoading && (
          <p className="text-center font-yummy text-xl text-red-500">Không có món ăn yêu thích nào</p>
        )}
        {/* container */}
      </div>
      <Footer />
    </div>
  );
}
