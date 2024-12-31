import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useRef, useState } from "react";
import { rateOrder } from "../../apis/order.api";
import { toast } from "react-toastify";
import { CartContext } from "../../context/cartContext";

import LoadingIndicator from "../UI/LoadingIndicator";
import { http } from "../../utils/http";

export default function RatingForm({ order }) {
  console.log("order", order);
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0); // Lưu trạng thái ngôi sao được chọn
  const [comment, setComment] = useState("");
  const cencalBtnRef = useRef(null);
  const { userId } = useContext(CartContext);

  const { mutate, isPending } = useMutation({
    mutationFn: rateOrder,
    onSuccess: (data) => {
      console.log("dataâ", data);
      toast.success("Thành công");
      setComment("");
      setRating("");
      // queryClient.invalidateQueries(["userinfo"]);
      cencalBtnRef.current.click();
    },
    onError: (err) => {
      toast.error("Thất bại");
      console.log("err rrr", err);
    },
  });

  const updateRankingStatusMutation = useMutation({
    mutationFn: async () => http.patch(`orders/${order.orderId}/update-rating-status`),
    onSuccess: (data) => {
      console.log("update tc", data);
      queryClient.invalidateQueries(["userinfo"]);
    },
    onError: (err) => {
      console.error("errr", err);
    },
  });

  // Hàm cập nhật khi người dùng click vào ngôi sao
  const handleStarClick = (index) => {
    setRating(index); // Lưu chỉ số ngôi sao được chọn
  };

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    if (!rating || !comment) {
      valid = false;
    }

    if (!valid) {
      toast.warning("Vui lòng không để trống thông tin nào", {
        position: "top-center",
      });
      return;
    }

    mutate(
      {
        comment: comment,
        rankingStars: rating,
        dishID: order.dish.dishId,
        userId: userId,
      },
      {
        onSuccess: () => {
          updateRankingStatusMutation.mutate();
        },
      },
    );
  };

  return (
    <div>
      {isPending && (
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black/20">
          <LoadingIndicator />
        </div>
      )}
      <div className="flex gap-2">
        {/* img container */}
        <div>
          <img className="size-16 rounded-sm object-cover" src={order.dish.image} alt={order.dish.dishName} />
        </div>
        <div className="uppercase">
          <p>{order.dish.dishName}</p>
        </div>
      </div>

      {/* Đánh giá sao */}
      <div className="mt-3 flex flex-col space-y-2 md:flex-row md:gap-11 md:space-y-0">
        <div>Chất lượng sản phẩm</div>
        <div>
          <div className="flex items-center space-x-2">
            {/* Hiển thị 5 ngôi sao */}
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                onClick={() => handleStarClick(star)} // Gọi hàm khi click
                xmlns="http://www.w3.org/2000/svg"
                fill={star <= rating ? "gold" : "none"} // Ngôi sao được chọn sẽ được tô màu
                stroke="gold" // Viền của ngôi sao
                strokeWidth={2}
                viewBox="0 0 24 24"
                className="size-6 cursor-pointer"
              >
                <path d="M12 .587l3.668 7.431 8.332 1.151-6.001 5.852 1.42 8.279L12 18.897l-7.419 3.903 1.42-8.279-6.001-5.852 8.332-1.151z" />
              </svg>
            ))}

            {/* Hiển thị trạng thái text */}
            <span className="text-gray-700">
              {rating === 0 && "Hãy chọn sao"}
              {rating === 1 && "Không hài lòng"}
              {rating === 2 && "Tạm được"}
              {rating === 3 && "Bình thường"}
              {rating === 4 && "Hài lòng"}
              {rating === 5 && "Rất hài lòng"}
            </span>
          </div>
        </div>
      </div>

      {/* Comment sản phẩm */}
      <div className="mt-3">
        <div className="bg-slate-200 p-2">
          {/* content */}
          <div className="border border-black p-1">
            <textarea
              onChange={handleChange}
              value={comment}
              className="min-h-52 w-full p-2 placeholder:text-xl"
              placeholder="Bình luận về món ăn"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Button container */}
      <div className="mt-3 flex justify-end gap-3">
        <button
          ref={cencalBtnRef}
          className="rounded-lg bg-slate-50 px-5 py-2.5 text-sm font-medium text-black hover:bg-slate-200 focus:outline-none"
          data-bs-dismiss="modal"
        >
          Trở lại{" "}
        </button>
        <button
          onClick={handleSubmit}
          className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300 dark:focus:ring-orange-900"
        >
          Đánh giá{" "}
        </button>
      </div>
    </div>
  );
}
