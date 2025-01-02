import React, { useContext, useState } from "react";
import Button from "../UI/Button";
import classes from "./MenuCategorySection.module.css";
import { formatName, getAccessToken, getRoleLS, normalizeNumber, transformCategoryNameToURL } from "../../utils/util";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DOMAIN } from "../../utils/const";
import { deleteFood, editFood } from "../../apis/foodApi";
import { toast } from "react-toastify";
import ModalOrdering from "../ModalOrdering/ModalOrdering";
import { fetchCategoryDetail } from "../../apis/category.api";
import { FavContext } from "../../context/favContext";
import EditFoodForm from "../EditFoodForm/EditFoodForm";
import LoadingIndicator from "../UI/LoadingIndicator";
import { addFav, fetchFavList } from "../../apis/fav.api";
import { CartContext } from "../../context/cartContext";
import LoadingModal from "../LoadingModal/LoadingModal";
import { useMediaQuery } from "react-responsive";
import classNames from "classnames";

export default function MenuCategorySection({
  category,
  catQueryData,
  catName,
  searchFoodList,
  searchName,
  filterType,
}) {
  // const { tableId } = useContext(CartContext);
  const [idToDelete, setIdToDelete] = useState("");
  const [editingFood, setEditingFood] = useState(null);
  const [foodToEdit, setFoodToEdit] = useState(null);
  const queryClient = useQueryClient();
  const token = getAccessToken();
  let favList = [];
  let favIdList = [];
  const { favList: favListContext, addItemToFav, removeItemFromFav } = useContext(FavContext);
  const { userId } = useContext(CartContext);

  const isDesktop = useMediaQuery({ minWidth: 1024 });
  // const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isMobile = useMediaQuery({ maxWidth: 1023 });

  const getFavQuery = useQuery({
    queryKey: ["favList", userId],
    queryFn: () => fetchFavList(userId),
    enabled: Boolean(token),
  });

  if (!token) {
    favList = favListContext;
    favIdList = favList.map((item) => item.dishId);
  } else {
    if (getFavQuery.data) {
      favList = getFavQuery.data.data.data.pageContent;
      favIdList = favList.map((item) => item.dish.dishId);
    }
  }

  //Có thể viết query này ở component cha, tránh mỗi category lại call api 1 lần
  const { data: mostPopularData } = useQuery({
    queryKey: ["menu", "most-popular"],
    staleTime: 20 * 1000,
    queryFn: async ({ signal }) => {
      try {
        const res = await fetch(`${DOMAIN}dishes/category/most%20popular`, { signal });

        const result = await res.json();

        return result.data;
      } catch (err) {
        throw err;
      }
    },
  });

  // const URL = `${DOMAIN}dishes/category/${}`;
  let categoryNameURL = "";
  if (category && !searchName) {
    categoryNameURL = transformCategoryNameToURL(`${category.categoryName}`);
  }
  const {
    data: categoryData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["menu", categoryNameURL],
    staleTime: 20 * 1000,
    queryFn: () => fetchCategoryDetail(categoryNameURL),
    enabled: Boolean(category && !searchName),
  });

  let finalCategoryData = [];
  if (categoryData) {
    finalCategoryData = categoryData.data.data;
  }

  if (catQueryData) {
    finalCategoryData = catQueryData;
  }

  if (searchFoodList) {
    finalCategoryData = searchFoodList;
  }

  const deleteMutation = useMutation({
    mutationFn: deleteFood,
    onSuccess: () => {
      toast.success("Xóa thành công");
      setIdToDelete("");
      queryClient.invalidateQueries(["menu"]);
    },
    onError: (err) => {
      console.error("Xóa thất bại", err);
      toast.error("Xóa thất bại");
    },
  });

  const editMutation = useMutation({
    mutationFn: editFood,
    onSuccess: () => {
      toast.success("Update food successfully");
      queryClient.invalidateQueries(["menu"]);
    },
    onError: (err) => {
      console.error("Sửa thất bại", err);
      toast.error("update food failed");
    },
  });

  const handleClickDelete = (id) => {
    setIdToDelete(id);
  };

  const handleCancelDelete = () => {
    setIdToDelete("");
  };

  const handleConfirmDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const clickEdit = (food) => () => {
    setEditingFood(true);
    setFoodToEdit(food);
  };

  const handleCancelEdit = () => {
    setEditingFood(false);
  };

  const handleSaveEdit = (foodAfterEdit) => {
    setEditingFood(false);

    editMutation.mutate({
      id: foodToEdit.dishId,
      formData: foodAfterEdit,
    });
  };

  const addToFavMutation = useMutation({
    mutationFn: addFav,
    onSuccess: () => {
      toast.success("Đã thêm vào danh sách món ăn yêu thích", { position: "top-center" });
      queryClient.invalidateQueries(["favList", userId]);
      // queryClient.refetchQueries(["favList", userId]);
      // getFavQuery.refetch();
    },
    onError: (err) => {
      toast.warning("Thức ăn này đã có trong danh sách yêu thích của bạn", { position: "top-center" });
    },
  });

  const handleAddFav = (food) => () => {
    if (!token) {
      addItemToFav(food);
    } else {
      addToFavMutation.mutate({
        dishId: food.dishId,
        userId: userId,
      });
    }
  };

  const mostPopularArray = mostPopularData?.map((food) => food.dishName);
  if (searchFoodList && searchFoodList.length === 0)
    return <p className="py-3 text-center font-yummy text-lg text-red-500">Không tìm thấy "{searchName}"</p>;

  const getFilteredData = () => {
    if (!finalCategoryData) return [];

    let filtered = [...finalCategoryData];

    switch (filterType) {
      case "price-asc":
        return filtered.sort((a, b) => a.price - b.price);
      case "price-desc":
        return filtered.sort((a, b) => b.price - a.price);
      case "purchased":
        return filtered.sort((a, b) => b.orderAmount - a.orderAmount);
      case "rating":
        return filtered.sort((a, b) => b.rankingAvg - a.rankingAvg);
      default:
        return filtered;
    }
  };

  return (
    <div className="menu-category">
      {addToFavMutation.isPending && <LoadingModal className="translate-x-0" />}
      {editMutation.isPending && (
        <div className="text-s fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className={classNames(`relative`, {
              "translate-x-0": isMobile,
              "translate-x-20": isDesktop,
            })}
          >
            <LoadingIndicator />
          </div>
        </div>
      )}
      {editingFood && <EditFoodForm food={foodToEdit} onCancel={handleCancelEdit} onSave={handleSaveEdit} />}
      {category && finalCategoryData?.length > 0 && (
        <h3 className={classes.title}>
          {category && <span>{formatName(category?.categoryName.toUpperCase() || "")}</span>}
          {/* <span>{formatName(category?.categoryName.toUpperCase() || "") || catName}</span> */}
        </h3>
      )}
      {catName && <h3 className={classes.title}>{catName && <span>{catName}</span>}</h3>}

      <ul className={`row gx-4 px-3 ${classes.category}`}>
        {getFilteredData().map((food) => {
          let isFav = false;
          favIdList.some((item) => item === food.dishId) ? (isFav = true) : (isFav = false);

          return (
            <li className="col-md-3 col-6 mb-4 pe-2 md:!pe-3" key={food.dishId}>
              <div className={`${classes["menu-category-content"]} rounded-md p-2 shadow-1 md:!p-3`}>
                <div className={classes.foodInfo}>
                  <p className={`${classes["foodInfo-status"]}`}>
                    {/* lấy từ data cho vào đây  food.status*/}
                    {food.status}
                  </p>
                  {mostPopularArray && mostPopularArray.includes(food.dishName) && (
                    <span className={`${classes["sale-status"]}`}>
                      {/* Kiểm tra sale status tương ứng để xuất ra logo tương ứng với css tương ứng */}
                      {/* <i class="fa-solid fa-fire"></i> */}
                    </span>
                  )}

                  <div className="overflow-hidden">
                    <Link to={`/food/${food.dishId}`}>
                      <img
                        className={`${classes.image} transition hover:scale-110`}
                        src={food.image}
                        alt={food.dishName}
                      />
                    </Link>
                  </div>
                  <Link to={`/food/${food.dishId}`}>
                    <p className={`fw-bold ${classes.foodName}`}>{food.dishName}</p>
                  </Link>
                  <div className="d-flex items-center justify-between gap-1">
                    <p>{food.orderAmount} purchased</p>
                    <p>{food.servedAmount} served amount</p>
                  </div>

                  <p className={classes.price}>${food.price}</p>
                </div>
                <div className={`${classes.footer} d-flex align-items-center justify-between`}>
                  <div className="food-review">
                    <div className="d-flex align-items-center gap-1">
                      {normalizeNumber(food.rankingAvg)}
                      <i className="fa fa-star text-warning"></i>
                      {/* <p>
                        {food.starAmount} ({food.reviewAmount} reviews)
                      </p> */}
                    </div>
                    {/* <div
                      className={`${classes["food-review-detail"]} d-flex align-items-center gap-2`}
                    >
                      <i className="fa fa-shopping-cart"></i>
                      <p>Ordered {food.orderedAmount} times</p>
                    </div> */}
                  </div>
                  <div>
                    {/* Tách component để xử lý state bên này, do có 2 component dùng modal này */}
                    <ModalOrdering
                      itemCart={food}
                      title={"Choose order detail"}
                      modalId={`CHOOSE_ORDER_DETAIL${food.dishId}`}
                      foodId={food.dishId}
                      size={"sm"}
                      triggeredButton={
                        <Button
                          disabled={food.status === "Out of stock"}
                          className={classNames(`food-review-button`, {
                            "cursor-not-allowed !bg-gray-500": food.status === "Out of stock",
                          })}
                        >
                          ORDER
                        </Button>
                      }
                    ></ModalOrdering>
                  </div>
                </div>
                <button
                  disabled={isFav}
                  className={classNames(`${classes["foodInfo-fav-btn"]}`, {
                    "cursor-not-allowed !bg-gray-400": isFav,
                  })}
                  onClick={handleAddFav(food)}
                >
                  <i className="fa-regular fa-heart"></i>
                </button>

                {getRoleLS() === "admin" && (
                  <>
                    <button onClick={clickEdit(food)} className={`${classes["foodInfo-edit-btn"]}`}>
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <div>
                      <button
                        onClick={() => handleClickDelete(food.dishId)}
                        className={`${classes["foodInfo-delelte-btn"]}`}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>

                      {idToDelete === food.dishId && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                          <div className={`${classes["pop-up"]} shadow-lg`}>
                            <p className="mb-3 text-center">Are you sure to delete?</p>
                            <button
                              onClick={handleCancelDelete}
                              type="button"
                              className="mb-2 me-2 rounded-lg border-2 border-red-700 px-5 py-2.5 text-center text-sm font-medium text-red-700 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
                            >
                              No
                            </button>
                            <button
                              disabled={deleteMutation.isPending}
                              onClick={() => handleConfirmDelete(food.dishId)}
                              type="button"
                              className={classNames(
                                "mb-2 me-2 rounded-lg border-2 border-blue-700 px-5 py-2.5 text-center text-sm font-medium text-blue-700 hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800",
                                {
                                  "cursor-not-allowed !bg-gray-500": deleteMutation.isPending,
                                },
                              )}
                            >
                              {deleteMutation.isPending ? "Deleting..." : "Yes"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </li>
            // <FoodItem
            //   food={food}
            //   handleCancelDelete={handleCancelDelete}
            //   handleClickDelete={handleClickDelete}
            //   handleConfirmDelete={handleConfirmDelete}
            //   mostPopularArray={mostPopularArray}
            //   showPopUp={showPopUp}
            //   deleteMutation={deleteMutation}
            // />
          );
        })}
      </ul>
    </div>
  );
}
