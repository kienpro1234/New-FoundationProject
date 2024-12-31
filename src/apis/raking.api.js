import { http } from "../utils/http";

export const fetchDishRanking = (dishId, queryParams) => {
  console.log("vao day disId", dishId);
  return http.get(`rankings/dishes/${dishId}/filter`, {
    params: {
      ...queryParams,
      pageSize: 4,
      rankingStars: queryParams?.rankingStars || 5,
    },
  });
};

export const fetchAllDishRanking = (dishId, queryParams) => {
  return http.get(`rankings/dishes/${dishId}`, {
    params: {
      ...queryParams,
      pageSize: 4,
    },
  });
};

export const fetchDishRankingAnalysis = (dishId) => http.get(`rankings/dishes/${dishId}/ranking-analysis`);
