import { http } from "../utils/http";

export const fetchCategoryDetail = (categoryName) => http.get(`dishes/category/${categoryName}`);
