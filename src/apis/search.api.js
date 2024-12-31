import { http } from "../utils/http";

export const searchFood = (params) => {
  return http.get(`dishes/search`, {
    params,
  });
};
