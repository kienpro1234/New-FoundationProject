import React from "react";
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
    content = <MenuCategorySection catQueryData={catQuery.data.data.data} catName={id} />;
  } else if (categoriesQuery.isSuccess && Array.isArray(categoriesQuery.data) && !searchParams.name) {
    content = categoriesQuery.data.map((category) => (
      <MenuCategorySection key={category.categoryId} category={category} />
    ));
  } else if (Boolean(searchFoodQuery.isSuccess && searchFoodQueryData)) {
    content = <MenuCategorySection searchFoodList={searchFoodQueryData} searchName={searchParams.name} />;
  } else {
    content = <ErrorBlock title={"No data found"} message={"No categories available"} />;
  }

  return <section className="menuDetails">{content}</section>;
}

//Code cũ thứ 2

// import React from "react";
// import MenuCategorySection from "../components/Menu/MenuCategorySection";
// import { useQuery } from "@tanstack/react-query";
// import { useParams } from "react-router-dom";
// import ErrorBlock from "../components/UI/ErrorBlock";
// import LoadingIndicator from "../components/UI/LoadingIndicator";
// import { DOMAIN } from "../utils/const";
// import { transformCategoryNameToURL } from "../utils/util";

// export default function MenuDetails() {
//   const { id } = useParams();
//   const correctId = transformCategoryNameToURL(id);
//   const isChoosingCategory = correctId !== "categories" && correctId !== "all";

//   // Query all categories
//   const categoriesQuery = useQuery({
//     queryKey: ["categories"],
//     queryFn: async ({ signal }) => {
//       const response = await fetch(`${DOMAIN}categories`, { signal });
//       const result = await response.json();
//       return result.data; // Trả về danh sách categories
//     },
//     enabled: !isChoosingCategory, // Chỉ gọi khi không chọn một category cụ thể
//   });

//   // Query specific category
//   const catQuery = useQuery({
//     queryKey: ["category", correctId],
//     queryFn: async ({ signal }) => {
//       const response = await fetch(`${DOMAIN}dishes/category/${correctId}`, { signal });
//       const result = await response.json();
//       return result.data; // Trả về dữ liệu chi tiết của category
//     },
//     enabled: isChoosingCategory, // Chỉ gọi khi chọn một category cụ thể
//   });

//   // Xử lý trạng thái
//   if (categoriesQuery.isLoading || catQuery.isLoading) {
//     return <LoadingIndicator />;
//   }

//   if (categoriesQuery.isError) {
//     return (
//       <ErrorBlock title={"Something went wrong"} message={categoriesQuery.error.message || "Can't fetch categories"} />
//     );
//   }

//   if (catQuery.isError) {
//     return (
//       <ErrorBlock title={"Something went wrong"} message={catQuery.error.message || "Can't fetch category details"} />
//     );
//   }

//   // Render nội dung dựa trên trạng thái
//   const content = isChoosingCategory ? (
//     <MenuCategorySection catQueryData={catQuery.data} catName={id} />
//   ) : (
//     categoriesQuery.data.map((category) => <MenuCategorySection key={category.categoryId} category={category} />)
//   );

//   return <section className="menuDetails">{content}</section>;
// }

// Code cũ nhất
// import React from "react";
// import MenuCategorySection from "../components/Menu/MenuCategorySection";
// import { useQuery } from "@tanstack/react-query";
// import { useParams } from "react-router-dom";
// import ErrorBlock from "../components/UI/ErrorBlock";
// import LoadingIndicator from "../components/UI/LoadingIndicator";
// import { DOMAIN } from "../utils/const";
// import { isObject, transformCategoryNameToURL } from "../utils/util";

// export default function MenuDetails() {
//   const { id } = useParams();
//   console.log("id ban dau", id);
//   const correctId = transformCategoryNameToURL(id);
//   console.log("correctId", correctId);
//   let url = `${DOMAIN}dishes/category/${correctId}`;
//   // if (params.id === "all") {
//   //   url += "category";
//   // } else {
//   //   url += `category/${params.id}`;
//   // }

//   console.log("urlrl", url);
//   const urlCategories = `${DOMAIN}categories`;

//   const isChoosingCategory = correctId !== "categories" && correctId !== "all";

//   console.log("isChoosing", isChoosingCategory);

//   // CATEGORIES QUERY
//   const categoriesQuery = useQuery({
//     // queryKey: ["menu", params.id], // Gắn params.id để key luôn cập nhật khi params thay đổi
//     queryKey: ["menu"],
//     queryFn: async ({ signal }) => {
//       try {
//         const response = await fetch(urlCategories, { signal });
//         // if (!response.ok) {
//         //   throw new Error("Network response was not ok");
//         // }
//         const result = await response.json();

//         console.log("result", result);
//         return result.data; // Trả về mảng data thực sự
//       } catch (err) {
//         throw err;
//       }
//     },
//     enabled: !isChoosingCategory,
//   });
//   console.log("data menuDetails", categoriesQuery.data);

//   // CATEGORY QUERY

//   const urlCat = `${DOMAIN}dishes/category/${correctId}`;
//   const catQuery = useQuery({
//     // queryKey: ["menu", params.id], // Gắn params.id để key luôn cập nhật khi params thay đổi
//     queryKey: ["menu", correctId],
//     queryFn: async ({ signal }) => {
//       try {
//         const response = await fetch(urlCat, { signal });
//         // if (!response.ok) {
//         //   throw new Error("Network response was not ok");
//         // }
//         const result = await response.json();

//         console.log("result", result);
//         return result.data; // Trả về mảng data thực sự
//       } catch (err) {
//         throw err;
//       }
//     },
//     enabled: isChoosingCategory,
//   });
//   console.log("data catQuery detail", catQuery.data);

//   let content;

//   if (categoriesQuery.isError) {
//     content = (
//       <ErrorBlock
//         title={"Something went wrong"}
//         message={categoriesQuery.error.message || "Can't fetch food categories"}
//       />
//     );
//   }

//   if (catQuery.isError) {
//     content = (
//       <ErrorBlock title={"Something went wrong"} message={catQuery.error.message || "Can't fetch food categories"} />
//     );
//   }

//   if (categoriesQuery.isLoading) {
//     content = <LoadingIndicator />;
//   }

//   if (catQuery.isLoading) {
//     content = <LoadingIndicator />;
//   }

//   if (categoriesQuery.data) {
//     content = (
//       <>
//         {/* {Array.isArray(data) && data.map((category, index) => <MenuCategorySection key={index} category={category} />)}
//         {isObject(data) && <MenuCategorySection category={data} />} */}
//         {categoriesQuery.data.map((category) => (
//           <MenuCategorySection key={category.categoryId} category={category} />
//         ))}
//       </>
//     );
//   }

//   if (catQuery.data) {
//     content = (
//       <>
//         <MenuCategorySection catQueryData={catQuery.data} catName={id} />
//       </>
//     );
//   }
//   return <section className="menuDetails">{content}</section>;
// }
