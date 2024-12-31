import React from "react";
import classes from "../Menu/MenuCategorySection.module.css";
import { Link } from "react-router-dom";
import Button from "../UI/Button";
import LoadingIndicator from "../UI/LoadingIndicator";
import { getRoleLS } from "../../utils/util";

export default function FoodItem({
  food,
  handleCancelDelete,
  handleClickDelete,
  handleConfirmDelete,
  mostPopularArray,
  showPopUp,
  deleteMutation,
}) {
  return (
    <li className="col-md-3 col-6 pe-2 md:!pe-3 mb-4 " key={food.id}>
      <div className={`${classes["menu-category-content"]} shadow-1 p-2 md:!p-3 rounded-md`}>
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
            <Link to={`/food/${food.id}`}>
              <img className={`${classes.image} hover:scale-110 transition`} src={food.image} alt={food.dishName} />
            </Link>
          </div>
          <Link to={`/food/${food.id}`}>
            <p className={`fw-bold ${classes.foodName}`}>{food.dishName}</p>
          </Link>
          <p className={classes.price}>${food.price}</p>
        </div>
        <div className={`${classes.footer} d-flex align-items-center justify-between`}>
          <div className="food-review">
            <div className="d-flex gap-1 align-items-center">
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
            <Button className="food-review-button">ORDER</Button>
          </div>
        </div>
        <button className={`${classes["foodInfo-fav-btn"]}`}>
          <i className="fa-regular fa-heart"></i>
        </button>

        {getRoleLS() === "admin" && (
          <>
            <button className={`${classes["foodInfo-edit-btn"]}`}>
              <i className="fa-solid fa-pen-to-square"></i>
            </button>
            <div>
              <button onClick={handleClickDelete} className={`${classes["foodInfo-delelte-btn"]}`}>
                <i className="fa-solid fa-trash"></i>
              </button>

              {showPopUp && (
                <>
                  {deleteMutation.isPending && (
                    <div className={`${classes["pop-up"]} shadow-lg`}>
                      <p className="text-center mb-3">Deleting...</p>
                      <LoadingIndicator />
                    </div>
                  )}
                  {!deleteMutation.isPending && (
                    <div className={`${classes["pop-up"]} shadow-lg`}>
                      <p className="text-center mb-3">Are you sure to delete?</p>
                      <button
                        onClick={handleCancelDelete}
                        type="button"
                        className="text-red-700 hover:text-white border-2 border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                      >
                        No
                      </button>
                      <button
                        onClick={() => handleConfirmDelete(food.id)}
                        type="button"
                        className="text-blue-700 hover:text-white border-2 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                      >
                        Yes
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </li>
  );
}
