import React, { useRef } from "react";
import classes from "./Food.module.css";

import Button from "../UI/Button";
import Modal from "../UI/Modal";
import ModalOrdering from "../ModalOrdering/ModalOrdering";
import classNames from "classnames";

export default function Food({ food }) {
  const imageRef = useRef(null);

  // const handleZoom = (event) => {
  //   const rect = event.currentTarget.getBoundingClientRect();
  //   const image = imageRef.current;
  //   const { naturalHeight, naturalWidth } = image;
  //   // const { offsetX, offsetY } = event.nativeEvent;
  //   const offsetX = event.pageX - (rect.x + window.scrollX);

  //   const offsetY = event.pageY - (rect.y + window.scrollY);
  //   const top = offsetY * (1 - naturalHeight / rect.height);
  //   const left = offsetX * (1 - naturalWidth / rect.width);

  //   image.style.width = naturalWidth + "px";
  //   image.style.height = naturalHeight + "px";
  //   image.style.maxWidth = "unset";

  //   image.style.top = top + "px";
  //   image.style.left = left + "px";
  // };

  // const handleRemoveZoom = () => {
  //   imageRef.current?.removeAttribute("style");
  // };
  return (
    <div className={`food ${classes["food-container"]}`}>
      <div className={`grid grid-cols-12 gap-9`}>
        <div className="col-span-12 md:col-span-5">
          <div className="relative w-full pt-[100%] shadow-img-food-detail">
            <img
              ref={imageRef}
              className={`absolute left-0 top-0 h-full w-full object-cover`}
              src={food.image}
              alt={food.image}
            />
          </div>
        </div>

        <div className="col-span-12 md:col-span-7">
          <div>
            <h1 className={classes.name}>{food.dishName.toUpperCase()}</h1>
            {/* <i className="fa fa-star text-warning"></i>
            <span style={{ color: "#999" }}>
              {food.starAmount} ({food.reviewAmount} reviews)
            </span>{" "} */}
            {/* |
            <span style={{ color: "#999" }}>
              {" "}
              <span style={{ fontWeight: "bolder" }}>
                Ordered {food.orderedAmount}
              </span>
            </span>
            //  */}

            <p className={classes.price}>{food.price}</p>
            <ModalOrdering
              itemCart={food}
              title={"Choose order detail"}
              modalId={`CHOOSE_ORDER_DETAIL${food.dishId}`}
              foodId={food.dishId}
              size={"sm"}
              triggeredButton={
                <Button
                  disabled={food.status === "Sold Out"}
                  className={classNames(`food-review-button`, {
                    "cursor-not-allowed !bg-gray-500": food.status === "Sold Out",
                  })}
                >
                  ORDER
                </Button>
              }
            ></ModalOrdering>

            <div className={`${classes["food-mainInfo"]} mt-4`}>
              <div className={classes.ingredients}>
                <h3 className="fw-bold">
                  <img
                    className="d-inline me-2"
                    src="https://img.tastykitchen.vn/cates/2021/12/17/icon1-e753.svg"
                    alt="https://img.tastykitchen.vn/cates/2021/12/17/icon1-e753.svg"
                  />
                  Ingredients:
                </h3>
                <p>{food.ingredient}</p>
              </div>
              <div className={classes.portion}>
                <h3 className="fw-bold">
                  <img
                    className="d-inline me-2"
                    src="https://static.tastykitchen.vn/images/icon-food/icon2.svg"
                    alt="https://static.tastykitchen.vn/images/icon-food/icon2.svg"
                  />
                  Portion:
                </h3>
                <p>{food.portion}</p>
              </div>
              <div>
                <h3 className="fw-bold">
                  <img
                    className="d-inline me-2"
                    src="https://img.tastykitchen.vn/cates/2021/12/17/icon3-420b.svg"
                    alt="https://static.tastykitchen.vn/images/icon-food/icon2.svg"
                  />
                  Cooking time:
                </h3>
                <p>{food.cookingTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="my-16 h-[1px] border-b border-dotted border-[#666]"></div>
      <div className={classes.description}>
        <h3 className="fw-bold">
          <img
            className="d-inline me-2"
            src="https://img.tastykitchen.vn/cates/2021/12/17/icon4-c817.svg"
            alt="https://img.tastykitchen.vn/cates/2021/12/17/icon4-c817.svg"
          />
          Description
        </h3>
        <p>{food.description}</p>
      </div>
    </div>
  );
}

// // CODE GIỮA

// CODE CŨ

// import React, { useRef } from "react";
// import classes from "./Food.module.css";

// import Button from "../UI/Button";
// import Modal from "../UI/Modal";
// import ModalOrdering from "../ModalOrdering/ModalOrdering";

// export default function Food({ food }) {
//   const imgRef = useRef(null);

//   const handleZoom = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const image = imgRef.current;
//     const { naturalHeight, naturalWidth } = image;
//     const offsetX = e.pageX - (rect.x + window.scrollX);
//     const offsetY = e.pageY - (rect.y + window.scrollY);

//     const top = offsetY * (1 - naturalHeight / rect.height);
//     const left = offsetX * (1 - naturalWidth / rect.width);

//     image.style.width = 720 + "px";
//     image.style.height = 720 + "px";
//     image.style.maxWidth = "unset";

//     image.style.top = top + "px";
//     image.style.left = left + "px";
//   };

//   const handleRemoveZoom = () => {
//     imgRef.current?.removeAttribute("style");
//   };
//   return (
//     <div className={`food ${classes["food-container"]}`}>
//       <div className={`d-flex gx-0 justify-content-center ${classes.food} row`}>
//         <div className="col-md-6 col-12 pe-md-4 mb-md-0 mb-5">
//           <img ref={imgRef} className={`${classes.image}`} src={food.image} alt={food.image} />
//         </div>
//         <div className="col-md-6 col-12">
//           <div>
//             <h1 className={classes.name}>{food.dishName.toUpperCase()}</h1>
//             {/* <i className="fa fa-star text-warning"></i>
//             <span style={{ color: "#999" }}>
//               {food.starAmount} ({food.reviewAmount} reviews)
//             </span>{" "} */}
//             {/* |
//             <span style={{ color: "#999" }}>
//               {" "}
//               <span style={{ fontWeight: "bolder" }}>
//                 Ordered {food.orderedAmount}
//               </span>
//             </span>
//             //  */}

//             <p className={classes.price}>{food.price}</p>
//             <ModalOrdering
//               itemCart={food}
//               title={"Choose order detail"}
//               id={"CHOOSE_ORDER_DETAIL"}
//               size={"sm"}
//               triggeredButton={<Button className="food-review-button">ORDER</Button>}
//             ></ModalOrdering>

//             <div className={classes["food-mainInfo"]}>
//               <div className={classes.ingredients}>
//                 <h3 className="fw-bold">
//                   <img
//                     className="d-inline me-2"
//                     src="https://img.tastykitchen.vn/cates/2021/12/17/icon1-e753.svg"
//                     alt="https://img.tastykitchen.vn/cates/2021/12/17/icon1-e753.svg"
//                   />
//                   Ingredients:
//                 </h3>
//                 <p>{food.ingredient}</p>
//               </div>
//               <div className={classes.portion}>
//                 <h3 className="fw-bold">
//                   <img
//                     className="d-inline me-2"
//                     src="https://static.tastykitchen.vn/images/icon-food/icon2.svg"
//                     alt="https://static.tastykitchen.vn/images/icon-food/icon2.svg"
//                   />
//                   Portion:
//                 </h3>
//                 <p>{food.portion}</p>
//               </div>
//               <div>
//                 <h3 className="fw-bold">
//                   <img
//                     className="d-inline me-2"
//                     src="https://img.tastykitchen.vn/cates/2021/12/17/icon3-420b.svg"
//                     alt="https://static.tastykitchen.vn/images/icon-food/icon2.svg"
//                   />
//                   Cooking time:
//                 </h3>
//                 <p>{food.cookingTime}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className={classes.description}>
//         <h3 className="fw-bold">
//           <img
//             className="d-inline me-2"
//             src="https://img.tastykitchen.vn/cates/2021/12/17/icon4-c817.svg"
//             alt="https://img.tastykitchen.vn/cates/2021/12/17/icon4-c817.svg"
//           />
//           Description
//         </h3>
//         <p>{food.description}</p>
//       </div>
//     </div>
//   );
// }
