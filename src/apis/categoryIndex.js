import { http } from "../utils/http";

export const fetchCategory = async ({ signal }) => {
  try {
    const res = await http.get(`categories`, { signal });

    // if (res.status < 200 || res.status >= 300) {
    //   throw new Error("Không thể fetch manu category");
    // }

    const result = res.data;

    return result.data;
  } catch (err) {
    console.error("Error fetching data:", err);
    throw err;
  }
};
