import React from "react";
import classes from "./MenuLanding.module.css";
import { formatName } from "../../utils/util";
export default function MenuLanding({ foodCategories, favPage, ...props }) {
  if (foodCategories) {
    console.log("food categories landing", foodCategories);
  }

  let categoryName = null;
  if (foodCategories?.length === 1) {
    categoryName = formatName(foodCategories[0].categoryName).toUpperCase();
  } else if (foodCategories?.length === 2) {
    categoryName =
      formatName(foodCategories[0].categoryName).toUpperCase() +
      " & " +
      formatName(foodCategories[1].categoryName).toUpperCase();
  }

  return (
    <div className={`${classes.menuLanding} menuLanding`}>
      <div className={classes["menuLanding-captions"]}>
        {!favPage && <h3 className="font-yummy !text-3xl !leading-5">MENU</h3>}

        <h2 className={favPage ? "border-b-2 border-b-white font-yummy !text-4xl" : "font-yummy !text-3xl"}>
          {favPage ? "YOUR FAVOURITE FOOD" : categoryName || props.aboutTitle || "TODAY'S MENU"}{" "}
        </h2>
      </div>
    </div>
  );
}
