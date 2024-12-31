import HeaderUser from "../../components/Header/HeaderUser";
import Greeting from "../../components/UserInformation/Greeting";
import UserInformation from "../../components/UserInformation/UserInformation";
import UserOrderList from "../../components/UserInformation/UserOrderList";
import { useContext, useEffect } from "react";

import { Navigate, useNavigate } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import LoadingIndicator from "../../components/UI/LoadingIndicator";
import ErrorBlock from "../../components/UI/ErrorBlock";
import { getToken, getUserIdLS } from "../../utils/util";
import { http } from "../../utils/http";
import { toast } from "react-toastify";
import { CartContext } from "../../context/cartContext";
import { fetchOrderList } from "../../apis/order.api";
import useQueryParams from "../../hooks/useQueryParams";
import Pagination from "../../components/Pagination/Pagination";

export default function UserInfo() {
  const queryParams = useQueryParams();
  console.log("query params", queryParams);
  const newQueryParams = {
    ...queryParams,
    pageNo: queryParams.pageNo || 1,
  };

  //Call api kèm theo token để lấy user info
  const token = getToken();
  const navigate = useNavigate();

  const { userId } = useContext(CartContext);
  const orderListQuery = useQuery({
    queryKey: ["orderList", newQueryParams],
    queryFn: () => fetchOrderList(userId, newQueryParams),
    placeholderData: keepPreviousData,
  });

  let orderList = [];
  if (orderListQuery.data) {
    console.log("datata", orderListQuery.data);
    orderList = orderListQuery.data.data.data.pageContent;
    console.log("orderList day", orderList);
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userinfo"],
    queryFn: async ({ signal }) => {
      const userId = getUserIdLS();
      const accessToken = getToken();
      try {
        const result = await http.get(`users/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          signal,
        });

        return result.data.data;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  });

  // useEffect(() => {
  //   if (!token) {
  //     toast.warning("Vui lòng đăng nhập để sử dụng chức năng này");
  //     navigate("/login");
  //   }
  // }, [token, navigate]);

  //Cần làm protectedRoute cho route này thay vì làm thủ công ở compoennt như này, khó kiếm
  if (!token) {
    alert("Vui lòng đăng nhập để sử dụng chức năng này");
    return <Navigate to="/login" />;
  }

  if (!token) return null; // Không render component khi chưa login
  let content;

  if (isLoading) {
    content = <LoadingIndicator />;
  }
  if (isError) {
    console.error("error", error);
    content = (
      <ErrorBlock
        title={`Lỗi ${error.response?.data?.code}, không thể fetch user`}
        message={error.response.data.message}
      />
    );
  }

  if (data) {
    content = (
      <>
        <div className="headerGreeting-userinfo">
          <div className="headerGreeting-wrapper-userinfo">
            <HeaderUser user={data} />
            <Greeting user={data} />
          </div>
        </div>
        <div className="userInfo">
          {/* <Header/> */}

          <UserInformation user={data} />
          <div className="max-auto mt-12 h-[1px] bg-slate-500"></div>
          <UserOrderList orderList={orderList} loadingOrderList={orderListQuery.isFetching} />
          <Pagination
            totalPages={orderListQuery?.data?.data?.data.totalPages}
            queryParams={queryParams}
            pathname={"/userinfo"}
          />
        </div>
      </>
    );
  }
  return <>{content}</>;
}
