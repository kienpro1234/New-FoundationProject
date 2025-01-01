import React, { useState } from "react";
import Input from "../UI/Input";
import Select from "react-select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCategory } from "../../apis/categoryIndex";
import LoadingIndicator from "../UI/LoadingIndicator";
import { toast } from "react-toastify";
import { addFood } from "../../apis/foodApi";

const initialFormData = {
  categories: [],
  dishName: "",
  image: "",
  description: "",
  price: "",
  status: "",
  ingredient: "",
  portion: "",
  cookingTime: "",
  servedAmount: "",
};

export default function AddFoodForm() {
  const [selectedValues, setSelectedValues] = useState(initialFormData);
  const queryClient = useQueryClient();

  const addFormMutation = useMutation({
    mutationFn: addFood,
    onSuccess: () => {
      toast.success("Thêm món ăn thành công!");
      setSelectedValues(initialFormData);
      queryClient.invalidateQueries(["menu"]);
    },
    onError: (err) => {
      console.error("err", err);
      toast.error(`Thêm món ăn thất bại`);
    },
  });

  const handleSelectCatChange = (categories) => {
    setSelectedValues((prev) => {
      return {
        ...prev,
        categories,
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedValues((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;

    for (const key in selectedValues) {
      if (Array.isArray(selectedValues[key]) && selectedValues[key].length === 0) {
        valid = false;
        break;
      } else if (selectedValues[key] === "") {
        valid = false;
        break;
      }
    }

    if (valid) {
      addFormMutation.mutate(selectedValues);
    } else {
      toast.error("Vui lòng không bỏ trống field nào!");
    }

    //Gọi mutate ở đây, lỗi ở form thì báo ở form, lỗi server thì báo ở server, lấy trạng thái isPending để hiển thị loading cho button submit
  };

  const handleCancel = () => {
    setSelectedValues(initialFormData);
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["menu-navbar"],
    queryFn: fetchCategory,
  });

  let options = [];
  if (data) {
    options = data.map((item) => ({
      value: item.categoryName,
      label: item.categoryName[0].toUpperCase() + item.categoryName.slice(1),
    }));
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className={`rounded-md`}>
        {/* Lấy về 1 list category từ api cho vào thẻ select*/}
        <div className="mb-[12px]">
          {/* Duyệt mảng in ra các option */}
          {/* <option value="" disabled hidden>
              Choose category
            </option> */}
          <label htmlFor="selectCat">Chọn loại thức ăn</label>
          {isLoading && <LoadingIndicator />}
          {data && (
            <Select
              value={selectedValues.categories}
              onChange={handleSelectCatChange}
              id="selectCat"
              isMulti
              className="basic-multi-select"
              classNamePrefix="select"
              options={options}
            ></Select>
          )}
        </div>

        <div className="mb-[12px] flex gap-1">
          <Input
            value={selectedValues.dishName}
            onChange={handleChange}
            name="dishName"
            className={"w-full border border-black focus:shadow-none"}
            placeholder={"Dish Name"}
          />
          <div className={``}></div>
          <Input
            value={selectedValues.cookingTime}
            onChange={handleChange}
            name="cookingTime"
            className={"w-full border border-black focus:shadow-none"}
            placeholder={"Cooking Time"}
          />
          <div className={``}></div>
        </div>
        {/* row */}
        <div className="mb-[12px] flex gap-1">
          <Input
            value={selectedValues.price}
            onChange={handleChange}
            name="price"
            className={"w-full border border-black focus:shadow-none"}
            placeholder={"Price"}
          />

          <select
            onChange={handleChange}
            className="option:dark:bg-gray-700 option:dark:text-white w-full border px-4 py-1.5 2xl:py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white [&_*]:dark:text-white"
            name="status"
            id=""
          >
            <option value="" hidden>
              Choose status
            </option>
            <option value="Ready to serve" className="dark:bg-gray-700 dark:text-white">
              Ready to serve
            </option>
            <option value="Out of stock" className="dark:bg-gray-700 dark:text-white">
              Out of stock
            </option>
          </select>
        </div>
        {/* row */}
        <div className="mb-[12px] flex gap-1">
          <Input
            value={selectedValues.portion}
            onChange={handleChange}
            name="portion"
            className={"w-full border border-black focus:shadow-none"}
            placeholder={"Portion"}
          />

          <Input
            value={selectedValues.servedAmount}
            onChange={handleChange}
            name="servedAmount"
            className={"w-full border border-black focus:shadow-none"}
            placeholder={"Served Amount"}
          />
        </div>
        <div className="mb-[12px]">
          <Input
            value={selectedValues.image}
            onChange={handleChange}
            name="image"
            className={"w-full border border-black focus:shadow-none"}
            placeholder={"Image"}
          />
        </div>
        <div className="mb-[12px]">
          <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Ingredients
          </label>
          <textarea
            value={selectedValues.ingredient}
            onChange={handleChange}
            name="ingredient"
            id="message"
            rows="4"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder=""
          ></textarea>
        </div>
        <div className="mb-[12px]">
          <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
            Description
          </label>
          <textarea
            value={selectedValues.description}
            onChange={handleChange}
            name="description"
            id="message"
            rows="4"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder=""
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleCancel}
            data-bs-dismiss="modal"
            type="button"
            className="mb-2 me-2 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={addFormMutation.isPending}
            className={`mb-2 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium !text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
              addFormMutation.isPending ? "cursor-no-drop" : ""
            }`}
          >
            {addFormMutation.isPending ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
