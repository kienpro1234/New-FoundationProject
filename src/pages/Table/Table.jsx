import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { deleteOrder, getTable, payOrders } from "../../apis/tableApi";
import LoadingIndicator from "../../components/UI/LoadingIndicator";
import ErrorBlock from "../../components/UI/ErrorBlock";
import { CartContext } from "../../context/cartContext";
import { toast } from "react-toastify";
import { createPortal } from "react-dom";
import { updateOrderStatus } from "../../apis/order.api";
import LoadingModal from "../../components/LoadingModal/LoadingModal";

export default function Table() {
  // lấy url của page này để call api fetch đến thông tin của table này, để hiển thị tương ứng
  // Lấy url ra
  const { setTableId, userId } = useContext(CartContext);
  const [orderIdDelete, setOrderIdDelete] = useState("");
  const queryClient = useQueryClient();
  const { tableId } = useParams();

  console.log("tableid", tableId);
  useEffect(() => {
    setTableId(tableId);
  }, []);
  const [isPositionValid, setIsPositionValid] = useState(true); // Đổi sang false sau
  // Lấy vị trí của người dùng, nếu phù hợp thì tiếp tục gửi api lên cho BE(api get table, gửi kèm position trong body) để lấy thông tin table hiển thị ra, link api cũng đồng thời là link trên url, gửi kèm position để BE kiểm tra nữa, nhưng trường hợp này chắc k cần
  function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Bán kính Trái Đất (km)
    console.log({
      lat1,
      lng1,
      lat2,
      lng2,
    });

    // Chuyển đổi độ sang radian
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;

    // Tọa độ điểm 1 và điểm 2 dưới dạng radian
    const radLat1 = (lat1 * Math.PI) / 180;
    const radLat2 = (lat2 * Math.PI) / 180;

    // Áp dụng công thức Haversine
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(radLat1) * Math.cos(radLat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Tính khoảng cách
    const distance = R * c;

    // Thêm ngưỡng sai số (epsilon) để xử lý các giá trị rất nhỏ
    // const epsilon = 0.05; // Ngưỡng sai số 50 mét
    // return distance < epsilon ? 0 : distance; // Nếu distance rất nhỏ, trả về 0
    return distance;
  }

  let userLatitude = "";
  let userLongitude = "";

  // Tọa độ của nhà hàng
  const restaurantLatitude = 21.0630371; //tọa độ của nhà hàng hiện tại đã được gán bằng tọa độ xấp xỉ với tạo độ của user
  const restaurantLongitude = 105.7187961; // tọa độ của nhà hàng hiện tại đã được gán bằng tọa độ xấp xỉ với tạo độ của user

  // const restaurantLatitude = 100;
  // const restaurantLongitude = 200;

  // const allowedRadius = 0.01; // Bán kính cho phép (ví dụ: 0.5 km)
  const allowedRadius = 0.015;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        userLatitude = position.coords.latitude;
        userLongitude = position.coords.longitude;

        console.log({
          lat: userLatitude,
          lng: userLongitude,
        });

        // Hàm tính khoảng cách giữa hai điểm (dựa trên tọa độ GPS)
        const distance = calculateDistance(userLatitude, userLongitude, restaurantLatitude, restaurantLongitude);

        console.log({
          distance,
          allowedRadius,
        });

        if (distance > allowedRadius) {
          alert(`Bạn không nằm trong phạm vi nhà hàng để order! 
                distance: ${distance}
            allowedRadius: ${allowedRadius}
            `);

          return (
            <p className="text-lg font-semibold text-red-500">
              Vị ví của bạn nằm ngoài phạm vi nhà hàng hoặc bạn chưa cung cấp vị trí
            </p>
          );

          // Chặn không cho phép order
        } else {
          alert(`Thành công
            distance: ${distance}
            allowedRadius: ${allowedRadius}
            `);
          setIsPositionValid(true);
        }
      },
      (error) => {
        alert("Không thể lấy vị trí của bạn. Vui lòng bật định vị GPS.");
        return false;
      },
    );
  }, []);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["table", tableId],
    queryFn: () => getTable(tableId),
    enabled: isPositionValid,
  });
  const tableOrderList = data?.data?.data?.pageContent || [];
  const tableOrderIdList = tableOrderList.map((order) => order.orderId);

  const { mutate, isPending } = useMutation({
    mutationFn: (orderId) => deleteOrder(orderId),
    onSuccess: () => {
      toast.success("Hủy thành công");
      queryClient.invalidateQueries({
        queryKey: ["table", tableId],
      });
    },
    onError: (err) => {
      console.error("error delete order", err);
      toast.error(err);
    },
  });

  const handleClickDelete = (orderId) => {
    setOrderIdDelete(orderId);
  };

  const handleConfirmDelete = (orderId) => {
    mutate(orderId);
    setOrderIdDelete("");
  };

  const paymentMutation = useMutation({
    mutationFn: (data) => payOrders(data),
    onSuccess: (data) => {
      console.log("payment response data", data);
      const paymentUrl = data.data.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
    },
    onError: (err) => {
      console.error("err payment", err);
    },
  });

  const handlePayment = () => {
    if (tableOrderIdList.length > 0) {
      paymentMutation.mutate({
        paymentMethod: "Vn-Pay",
        userId: userId,
        orderIds: [...tableOrderIdList],
      });
    } else {
      toast.warning("Hiện không có order nào để thanh toán", {
        position: "top-center",
      });
    }
  };

  const confirmOrderMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: (data) => {
      toast.success("Thành công", { position: "top-center" });
      refetch();
    },
    onError: (err) => {
      toast.error("Update thất bại", { position: "top-center" });
      console.error("err update status order", err);
    },
  });

  const handleConfirmOrder = (orderId, orderStatus) => {
    confirmOrderMutation.mutate({ orderId, orderStatus });
  };

  let dataTable = "";
  if (data) {
    console.log("data", data);
    dataTable = data.data.data.pageContent;
    console.log("datatable", dataTable);
  }

  let content = <></>;
  if (!isPositionValid) {
    content = <p className="text-lg font-semibold text-red-500">Vị trí không phù hợp</p>;
  }

  if (isError) {
    content = <ErrorBlock message={"Không thể fetch table"} title={"Lỗi"} />;
  }
  if (dataTable) {
    content = (
      <div className="h-screen overflow-auto bg-pink-red">
        {/* Container */}
        <div className="px-8 py-3">
          {/* title */}
          <h1 className="border-b-[1.5px] border-red-500 pb-3 font-yummy text-6xl capitalize text-red-500">
            table {tableId}
          </h1>
          {/* Content top */}
          <div className="min-h-[533px] py-20">
            {/* flex*/}
            <div className="flex flex-col gap-3">
              {dataTable.map((order) => (
                <div
                  key={order.orderId}
                  className="flex items-center justify-between rounded-3xl border-[1.5px] border-black bg-gray-50 px-3 py-2 font-bold"
                >
                  <div className="space-y-1">
                    <h3 className="text-xl text-red-500">{order.dish.dishName}</h3>
                    <p className="">Quantity: {order.quantity}</p>
                    <p className="">Status: {order.status ? "Đã thanh toán" : "Chưa thanh toán"}</p>
                    <div>
                      {order.orderStatus === "considering" && (
                        <>
                          <button
                            className="me-1 rounded-lg bg-red-600 px-2 py-1 text-white shadow"
                            onClick={() => handleClickDelete(order.orderId)}
                          >
                            Hủy
                          </button>
                          <button
                            className="rounded-lg bg-green-600 px-2 py-1 text-white shadow"
                            onClick={() => handleConfirmOrder(order.orderId, "pending")}
                          >
                            Xác nhận đơn
                          </button>
                        </>
                      )}
                      {/* considering, pending, served */}
                      {order.orderStatus === "pending" && (
                        <p className="inline rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                          Đang chuẩn bị
                        </p>
                      )}

                      {order.orderStatus === "served" && (
                        <p className="inline rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">Đã phục vụ</p>
                      )}

                      {orderIdDelete === order.orderId && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                          <div className={`pop-up-delete rounded-md shadow-lg`}>
                            <p className="mb-3 text-center">Are you sure to delete?</p>
                            <button
                              onClick={() => {
                                setOrderIdDelete("");
                              }}
                              type="button"
                              className="mb-2 me-2 rounded-lg border-2 border-red-700 px-5 py-2.5 text-center text-sm font-medium text-red-700 hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
                            >
                              No
                            </button>
                            <button
                              onClick={() => handleConfirmDelete(order.orderId)}
                              type="button"
                              className="mb-2 me-2 rounded-lg border-2 border-blue-700 px-5 py-2.5 text-center text-sm font-medium text-blue-700 hover:bg-blue-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
                            >
                              Yes
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <img src={order.dish.image} alt="" className="size-16 rounded-full object-cover shadow-md" />
                  </div>
                </div>
              ))}
              {/* item */}

              {/* <div className="rounded-3xl border-[1.5px] border-black bg-gray-50 px-3 py-2 font-bold">
          <h3 className="text-xl text-red-500">Order #123123</h3>
          <p className="">Food list:</p>
          <p className="">Status: </p>
        </div>
        <div className="rounded-3xl border-[1.5px] border-black bg-gray-50 px-3 py-2 font-bold">
          <h3 className="text-xl text-red-500">Order #123123</h3>
          <p className="">Food list:</p>
          <p className="">Status: </p>
        </div> */}
            </div>
          </div>
          {/* Content bottom */}
          <div>
            <div className="flex justify-between">
              <button
                className="w-32 rounded-xl bg-emerald-500 py-[11px] text-4xl font-bold text-white hover:bg-emerald-400"
                onClick={handlePayment}
              >
                Pay
              </button>
              <Link to={"/menu/all"}>
                <button className="w-32 rounded-xl bg-red-500 py-[11px] text-4xl font-bold text-white hover:bg-red-400">
                  Order
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (isLoading) {
    content = <LoadingIndicator />;
  }
  // Nếu vị trí không phù hợp thì return vị trí không phù hợp, không return ra gì / TƯơng tự với trường hợp người dùng từ chối cung cấp vị trí
  return (
    <>
      {console.log("isPending", isPending)}
      {(isPending || paymentMutation.isPending || confirmOrderMutation.isPending) && (
        <LoadingModal className="translate-x-0" />
      )}
      {content}
    </>
  );
}
