import { http } from "../utils/http";

export const updateUser = ({ data, userId }) => {
  console.log("userIdbang", userId);
  return http.put(`users/${userId}`, data);
};
