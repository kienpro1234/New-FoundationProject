import { http } from "../utils/http";
import { getToken } from "../utils/util";

export const addFood = async (formData) => {
  const payload = {
    ...formData,
    categories: formData.categories.map((cate) => cate.value),
  };
  return http.post("dishes", payload, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const deleteFood = async (id) => {
  console.log("id", id);
  return http.delete(`dishes/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const editFood = async ({ id, formData }) => {
  return http.put(`dishes/${id}`, formData);
};
