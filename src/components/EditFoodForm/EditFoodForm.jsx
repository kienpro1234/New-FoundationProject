import React, { useState } from "react";
import { http } from "../../utils/http";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";

// export default function EditFoodForm({ food, onCancel, onSave }) {
//   console.log("fooddy", food);
//   const [formData, setFormData] = useState({
//     ...food,
//     categories: food.categories.map((category) => category.categoryName),
//   });
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const { data: categories = [] } = useQuery({
//     queryKey: ["categories"],
//     queryFn: async () => {
//       const response = await http("categories");
//       return response.data.data;
//     },
//   });

//   //   Categories chooosing
//   // Add this function to handle react-select onChange
//   const handleCategoryChange = (selectedOptions) => {
//     setFormData({
//       ...formData,
//       categories: selectedOptions.map((option) => option.value),
//     });
//   };

//   // Format categories for react-select
//   const categoryOptions = categories.map((category) => ({
//     value: category.categoryName,
//     label: category.categoryName,
//   }));

//   console.log("categoryOptions", categoryOptions);

//   // Find default values for react-select
//   console.log("formData.categories", formData.categories);
//   const defaultCategories = categoryOptions.filter((option) => formData.categories?.includes(option.value));

//   console.log("default,,", defaultCategories);

//   //   Categories chooosing
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
//       <div className="max-h-[90vh] w-[800px] overflow-y-auto rounded-lg bg-white p-6">
//         <div className="top-0 z-10 mb-4 flex items-center justify-between bg-white pb-4">
//           <h2 className="text-xl font-bold">Edit Food Item</h2>
//           <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
//             <i className="fa-solid fa-times"></i>
//           </button>
//         </div>

//         <form className="space-y-4">
//           {/* Dish Name */}
//           <div>
//             <label className="mb-1 block text-sm font-medium">{food.dishName}</label>
//             <input
//               type="text"
//               className="w-full rounded-md border border-gray-300 p-2"
//               placeholder="Enter dish name"
//               name="dishName"
//               value={formData.dishName}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Image URL */}
//           <div>
//             <label className="mb-1 block text-sm font-medium">Image URL</label>
//             <input
//               type="text"
//               className="w-full rounded-md border border-gray-300 p-2"
//               placeholder="Enter image URL"
//               name="imageUrl"
//               value={formData.image}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label className="mb-1 block text-sm font-medium">Description</label>
//             <textarea
//               className="min-h-64 w-full rounded-md border border-gray-300 p-2"
//               rows="3"
//               placeholder="Enter description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//             ></textarea>
//           </div>

//           {/* Price and Status - Side by side */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="mb-1 block text-sm font-medium">Price ($)</label>
//               <input
//                 type="number"
//                 className="w-full rounded-md border border-gray-300 p-2"
//                 placeholder="0.00"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label className="mb-1 block text-sm font-medium">Status</label>
//               <select
//                 className="w-full rounded-md border border-gray-300 p-2"
//                 name="status"
//                 value={formData.status}
//                 onChange={handleChange}
//               >
//                 <option>Available</option>
//                 <option>Sold Out</option>
//                 <option>Coming Soon</option>
//               </select>
//             </div>
//           </div>

//           {/* Ingredients */}
//           <div>
//             <label className="mb-1 block text-sm font-medium">Ingredients</label>
//             <input
//               type="text"
//               className="w-full rounded-md border border-gray-300 p-2"
//               placeholder="Enter ingredients"
//               name="ingredients"
//               value={formData.ingredient}
//               onChange={handleChange}
//             />
//           </div>

//           {/* Portion and Cooking Time - Side by side */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="mb-1 block text-sm font-medium">Portion Size</label>
//               <input
//                 type="number"
//                 className="w-full rounded-md border border-gray-300 p-2"
//                 placeholder="Enter portion size"
//                 name="portion"
//                 value={formData.portion}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <label className="mb-1 block text-sm font-medium">Cooking Time (mins)</label>
//               <input
//                 type="number"
//                 className="w-full rounded-md border border-gray-300 p-2"
//                 placeholder="Enter cooking time"
//                 name="cookingTime"
//                 value={formData.cookingTime}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           {/* Categories */}
//           <div>
//             <label className="mb-1 block text-sm font-medium">Categories</label>
//             <Select
//               isMulti
//               name="categories"
//               options={categoryOptions}
//               value={defaultCategories}
//               onChange={handleCategoryChange}
//               className="basic-multi-select"
//               classNamePrefix="select"
//             />
//           </div>

//           {/* Action Buttons */}
//           <div className="flex justify-end space-x-3 pt-4">
//             <button
//               type="button"
//               onClick={onCancel}
//               className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               onClick={() => onSave(formData)}
//               type="submit"
//               className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
//             >
//               Save Changes
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

export default function EditFoodForm({ food, onCancel, onSave }) {
  const [formData, setFormData] = useState({
    ...food,
    categories: food.categories.map((category) => category.categoryName),
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await http("categories");
      return response.data.data;
    },
  });

  const handleCategoryChange = (selectedOptions) => {
    setFormData({
      ...formData,
      categories: selectedOptions.map((option) => option.value),
    });
  };

  const categoryOptions = categories.map((category) => ({
    value: category.categoryName,
    label: category.categoryName,
  }));

  const defaultCategories = categoryOptions.filter((option) => formData.categories?.includes(option.value));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 dark:bg-gray-800 dark:bg-opacity-75">
      <div className="max-h-[90vh] w-[800px] overflow-y-auto rounded-lg bg-white p-6 dark:bg-gray-900 dark:text-gray-200">
        <div className="top-0 z-10 mb-4 flex items-center justify-between bg-white pb-4 dark:bg-gray-900">
          <h2 className="text-xl font-bold text-black">Edit Food Item</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        <form className="space-y-4">
          {/* Dish Name */}
          <div>
            <label className="mb-1 block text-sm font-medium dark:text-gray-600">{food.dishName}</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="Enter dish name"
              name="dishName"
              value={formData.dishName}
              onChange={handleChange}
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="mb-1 block text-sm font-medium dark:text-gray-600">Image URL</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="Enter image URL"
              name="imageUrl"
              value={formData.image}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1 block text-sm font-medium dark:text-gray-600">Description</label>
            <textarea
              className="min-h-64 w-full rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              rows="3"
              placeholder="Enter description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Price and Status - Side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium dark:text-gray-600">Price ($)</label>
              <input
                type="number"
                className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                placeholder="0.00"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium dark:text-gray-600">Status</label>
              <select
                className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Available</option>
                <option>Sold Out</option>
                <option>Coming Soon</option>
              </select>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="mb-1 block text-sm font-medium dark:text-gray-600">Ingredients</label>
            <input
              type="text"
              className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              placeholder="Enter ingredients"
              name="ingredients"
              value={formData.ingredient}
              onChange={handleChange}
            />
          </div>

          {/* Portion and Cooking Time - Side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium dark:text-gray-600">Portion Size</label>
              <input
                type="number"
                className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                placeholder="Enter portion size"
                name="portion"
                value={formData.portion}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium dark:text-gray-600">Cooking Time (mins)</label>
              <input
                type="number"
                className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                placeholder="Enter cooking time"
                name="cookingTime"
                value={formData.cookingTime}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="mb-1 block text-sm font-medium dark:text-gray-600">Categories</label>
            <Select
              isMulti
              name="categories"
              options={categoryOptions}
              value={defaultCategories}
              onChange={handleCategoryChange}
              className="basic-multi-select dark:bg-gray-800 dark:text-gray-600"
              classNamePrefix="select"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(formData)}
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 dark:bg-blue-800 dark:hover:bg-blue-900"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
