import { http } from "../utils/http";

export const addFav = (data) => http.post("favorites", data);

export const fetchFavList = (userId) => http.get(`favorites/user/${userId}`);

export const deleteFavFood = (favId) => http.delete(`favorites/${favId}`);
