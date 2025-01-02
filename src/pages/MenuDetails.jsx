import React, { useState } from "react";
import MenuCategorySection from "../components/Menu/MenuCategorySection";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import ErrorBlock from "../components/UI/ErrorBlock";
import LoadingIndicator from "../components/UI/LoadingIndicator";
import { DOMAIN } from "../utils/const";
import { transformCategoryNameToURL } from "../utils/util";
import { fetchCategoryDetail } from "../apis/category.api";
import useQueryParams from "../hooks/useQueryParams";
import { searchFood } from "../apis/search.api";

export default function MenuDetails() {
  const { id } = useParams();
  const searchParams = useQueryParams();
  const [filterType, setFilterType] = useState("none");

  const correctId = transformCategoryNameToURL(id);

  //Kiểm tra hiện tại có đang chọn filter khác all hay là đang chọn all
  const isChoosingCategory = correctId !== "categories" && correctId !== "all";

  // Query all categories , để gọi data cho trường hợp all, tức là gọi toàn bộ categories
  const categoriesQuery = useQuery({
    queryKey: ["menu"],
    staleTime: 20 * 1000,
    queryFn: async ({ signal }) => {
      const response = await fetch(`${DOMAIN}categories`, { signal });
      const result = await response.json();
      return result.data; // Trả về danh sách categories
    },
    enabled: !isChoosingCategory && !searchParams?.name, // Chỉ gọi khi không chọn một category cụ thể
  });

  // Query specific category (Để gọi data cho trường hợp chọn filter)
  const catQuery = useQuery({
    queryKey: ["menu", correctId],
    queryFn: () => fetchCategoryDetail(correctId),
    enabled: isChoosingCategory && !searchParams?.name, // Chỉ gọi khi chọn một category cụ thể
  });

  // Khi search xong thì đường link thay đổi url -> bỏ active đi ở các mục , fetch về 1 list, truyền vào cho categorySection render
  // Lấy query params từ url , rest nó ra, và dùng Object.fromEntries để biến nó thành object queryConfig đã, rồi mới lấy nó ở đây
  const searchFoodQuery = useQuery({
    queryKey: ["searchedList", searchParams.name],
    staleTime: 20 * 1000,
    queryFn: () => searchFood(searchParams),
    enabled: Boolean(searchParams?.name),
  });

  let searchFoodQueryData = null;

  if (searchFoodQuery.isError) {
    console.log("loi search food query", searchFoodQuery.error);
  }

  if (searchFoodQuery.data) {
    searchFoodQueryData = searchFoodQuery.data.data.data.pageContent;
  }

  if (searchFoodQuery.isLoading) {
    return <LoadingIndicator />;
  }

  // export const fetchCategoryDetail = (categoryName) => http.get(`dishes/category/${categoryName}`);

  // Xử lý trạng thái tải dữ liệu hoặc lỗi // Lỗi chính là ở đây, cho content = Loading indicator có vẻ k hiệu nghiệm // Vì nếu có 2 query một lúc như thế mà lại cho content = LoadingIndicator cho cả 2 thì bị lỗi gì ấy
  if (categoriesQuery.isLoading || catQuery.isLoading) {
    return <LoadingIndicator />;
  }

  if (categoriesQuery.isError) {
    return (
      <ErrorBlock title={"Something went wrong"} message={categoriesQuery.error.message || "Can't fetch categories"} />
    );
  }

  if (catQuery.isError) {
    return (
      <ErrorBlock title={"Something went wrong"} message={catQuery.error.message || "Can't fetch category details"} />
    );
  }

  // Chỉ render khi dữ liệu đã có
  let content = null;

  if (isChoosingCategory && catQuery.isSuccess && catQuery.data.data && !searchParams.name) {
    content = <MenuCategorySection catQueryData={catQuery.data.data.data} catName={id} filterType={filterType} />;
  } else if (categoriesQuery.isSuccess && Array.isArray(categoriesQuery.data) && !searchParams.name) {
    content = categoriesQuery.data.map((category) => (
      <MenuCategorySection key={category.categoryId} category={category} filterType={filterType} />
    ));
  } else if (Boolean(searchFoodQuery.isSuccess && searchFoodQueryData)) {
    content = (
      <MenuCategorySection
        searchFoodList={searchFoodQueryData}
        searchName={searchParams.name}
        filterType={filterType}
      />
    );
  } else {
    content = <ErrorBlock title={"No data found"} message={"No categories available"} />;
  }

  return (
    <section className="menuDetails">
      <div className="mb-4 flex items-center gap-2 px-3">
        <span className="font-medium">Sort all items by:</span>
        <select className="rounded-md border p-2" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="none">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="purchased">Most Purchased</option>
          <option value="rating">Highest Rating</option>
        </select>
      </div>
      {content}
    </section>
  );
}
