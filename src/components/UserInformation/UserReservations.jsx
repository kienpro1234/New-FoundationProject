import React, { useContext, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as PendingIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { http } from "../../utils/http";
import { CartContext } from "../../context/cartContext";
import LoadingModal from "../LoadingModal/LoadingModal";
import { toast } from "react-toastify";
import useQueryParams from "../../hooks/useQueryParams";
import LoadingIndicator from "../UI/LoadingIndicator";
import Pagination from "../Pagination/Pagination";
import { payOrders } from "../../apis/tableApi";
import { Link } from "react-router-dom";

export default function UserReservations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrders, setSelectedOrders] = useState(null);
  const { userId } = useContext(CartContext);
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const queryParams = useQueryParams();
  console.log("query params", queryParams);
  const newQueryParams = {
    ...queryParams,
    pageNo: queryParams?.pageNo || 1,
  };

  const {
    data: reservationsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["userReservations", userId, newQueryParams],
    queryFn: async () => {
      const response = await http.get(`reservations/user/${userId}`, {
        params: {
          ...newQueryParams,
          pageSize: 10,
        },
      });
      return response.data.data;
    },
  });
  if (reservationsData) {
    console.log("reservationsData", reservationsData);
  }

  const confirmMutation = useMutation({
    mutationFn: async (reservationId) => {
      return await http.patch(`reservations/${reservationId}/confirm-reservation-status`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userReservations"]);
      toast.success("Xác nhận đặt chỗ thành công");
    },
    onError: () => {
      toast.error("Không thể xác nhận đặt chỗ");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (reservationId) => {
      return await http.delete(`reservations/${reservationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userReservations"]);
      toast.success("Hủy đặt chỗ thành công");
    },
    onError: () => {
      toast.error("Không thể hủy đặt chỗ");
    },
  });

  const paymentMutation = useMutation({
    mutationFn: (data) => payOrders(data),
    onSuccess: (data) => {
      const paymentUrl = data.data.paymentUrl;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
    },
    onError: (err) => {
      console.error("err payment", err);
      toast.error("Thanh toán thất bại");
    },
  });

  const handleConfirm = (reservationId, orderIds) => {
    if (window.confirm("Bạn có chắc chắn muốn xác nhận và thanh toán đặt chỗ này?")) {
      if (orderIds && orderIds.length > 0) {
        paymentMutation.mutate({
          paymentMethod: "Vn-Pay",
          userId: userId,
          reservationId: reservationId,
          orderIds: orderIds,
        });
      } else {
        toast.warning("Không có món nào để thanh toán", {
          position: "top-center",
        });
      }
    }
  };

  const handleDelete = (reservationId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đặt chỗ này?")) {
      deleteMutation.mutate(reservationId);
    }
  };

  const getStatusChip = (status) => {
    const chipStyle = {
      width: 180,
      justifyContent: "center",
    };

    switch (status.toLowerCase()) {
      case "pending":
        return <Chip icon={<PendingIcon />} label="Đang chờ xác nhận" color="warning" sx={chipStyle} />;
      case "paid":
        return <Chip icon={<CheckCircleIcon />} label="Đã xác nhận" color="success" sx={chipStyle} />;
      case "cancelled":
        return <Chip icon={<CancelIcon />} label="Đã hủy" color="error" sx={chipStyle} />;
      default:
        return <Chip label={status} sx={chipStyle} />;
    }
  };

  const formatOrders = (orders) => {
    if (!orders || orders.length === 0) return "Không có món";

    const orderNames = orders.map((order) => order.dish.dishName);
    if (orderNames.length <= 3) {
      return orderNames.join(", ");
    }
    return (
      <span>
        {orderNames.slice(0, 3).join(", ")}...{" "}
        <span className="font-medium text-blue-600 hover:text-blue-800">Click để xem chi tiết</span>
      </span>
    );
  };

  const handleOpenOrdersDialog = (orders) => {
    setSelectedOrders(orders);
  };

  const handleCloseOrdersDialog = () => {
    setSelectedOrders(null);
  };

  const FilterSection = () => (
    <Box sx={{ display: "flex", gap: 1, mb: 2, p: 2 }}>
      <Chip
        label="Tất cả"
        onClick={() => setStatusFilter("all")}
        color={statusFilter === "all" ? "primary" : "default"}
        variant={statusFilter === "all" ? "filled" : "outlined"}
      />
      <Chip
        label="Đang chờ xác nhận"
        onClick={() => setStatusFilter("pending")}
        color={statusFilter === "pending" ? "primary" : "default"}
        variant={statusFilter === "pending" ? "filled" : "outlined"}
      />
      <Chip
        label="Đã xác nhận"
        onClick={() => setStatusFilter("confirmed")}
        color={statusFilter === "confirmed" ? "primary" : "default"}
        variant={statusFilter === "confirmed" ? "filled" : "outlined"}
      />
    </Box>
  );

  if (isLoading) {
    return (
      //   <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
      //     <CircularProgress />
      //   </Box>
      <div className="flex justify-center p-3">
        <LoadingIndicator />
      </div>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Không thể tải lịch sử đặt chỗ: {error.message}</Alert>
      </Box>
    );
  }

  const filteredReservations =
    reservationsData?.pageContent?.filter((row) => {
      const formattedDate = format(new Date(row.orderTime), "dd/MM/yyyy HH:mm");
      const matchesSearch = formattedDate.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "confirmed" && row.status.toLowerCase() === "paid") ||
        (statusFilter === "pending" && row.status.toLowerCase() === "pending") ||
        (statusFilter === "cancelled" && row.status.toLowerCase() === "cancelled");
      return matchesSearch && matchesStatus;
    }) || [];

  return (
    <Box className="container mx-auto px-4 py-8">
      {(confirmMutation.isPending || deleteMutation.isPending || paymentMutation.isPending) && (
        <LoadingModal className="translate-x-0" />
      )}
      <div className="mb-4 flex items-center justify-between">
        <Typography variant="h4">Your reservations</Typography>
        <Link
          to="/menu/all"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700"
        >
          Back to menu
        </Link>
      </div>

      <Paper sx={{ width: "100%", mb: 2, borderRadius: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tìm kiếm theo ngày: VD: 06/02 hoặc giờ: VD: 15:30, 3:12 hoặc năm: VD: 2025"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <FilterSection />
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                <TableCell width="15%">Thời gian đặt</TableCell>
                <TableCell width="15%">Vị trí bàn</TableCell>
                <TableCell width="15%">Tổng tiền</TableCell>
                <TableCell width="20%">Món đã đặt</TableCell>
                <TableCell width="10%">Loại</TableCell>
                <TableCell width="15%">Trạng thái</TableCell>
                <TableCell width="15%">Ghi chú</TableCell>
                <TableCell width="10%">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReservations.map((row) => (
                <TableRow hover key={row.reservationId}>
                  <TableCell>{format(new Date(row.orderTime), "dd/MM/yyyy HH:mm")}</TableCell>
                  <TableCell>{row.positions || "Chưa được sắp xếp"}</TableCell>
                  <TableCell>
                    {row.totalPrice
                      ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(row.totalPrice)
                      : "Chưa tính"}
                  </TableCell>
                  <TableCell>
                    <Box
                      onClick={() => row.orders && row.orders.length > 0 && handleOpenOrdersDialog(row.orders)}
                      sx={{
                        cursor: row.orders?.length > 0 ? "pointer" : "default",
                        "&:hover": {
                          textDecoration: row.orders?.length > 0 ? "underline" : "none",
                        },
                      }}
                    >
                      {formatOrders(row.orders)}
                    </Box>
                  </TableCell>
                  <TableCell>{row.type ? "Tại nhà hàng" : "Mang về"}</TableCell>
                  <TableCell>{getStatusChip(row.status)}</TableCell>
                  <TableCell>{row.note || "Không có ghi chú"}</TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {row.status.toLowerCase() === "pending" && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          whiteSpace: "nowrap",
                          gap: 1,
                        }}
                      >
                        <Tooltip title="Xác nhận và thanh toán đặt chỗ">
                          <IconButton
                            color="primary"
                            onClick={() =>
                              handleConfirm(
                                row.reservationId,
                                row.orders?.map((order) => order.orderId),
                              )
                            }
                            disabled={paymentMutation.isLoading}
                          >
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Hủy đặt chỗ">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(row.reservationId)}
                            disabled={deleteMutation.isLoading}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {filteredReservations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Không tìm thấy lịch sử đặt chỗ nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Orders Detail Dialog */}
      <Dialog open={!!selectedOrders} onClose={handleCloseOrdersDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Chi tiết món đã đặt</DialogTitle>
        <DialogContent>
          <List>
            {selectedOrders?.map((order, index) => (
              <ListItem key={index} alignItems="flex-start">
                <Link to={`/food/${order.dish.dishId}`}>
                  <img
                    src={order.dish.image}
                    alt={order.dish.dishName}
                    style={{ width: 80, height: 80, objectFit: "cover", marginRight: 16, borderRadius: 8 }}
                  />
                </Link>
                <ListItemText
                  primary={order.dish.dishName}
                  secondary={
                    <Typography
                      component="div"
                      variant="body2"
                      color="text.primary"
                      sx={{ display: "flex", gap: 2, mt: 1 }}
                    >
                      <span>SL: {order.quantity}</span>
                      <span>•</span>
                      <span>
                        Đơn giá:{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(order.dish.price * 23000)}
                      </span>
                      <span>•</span>
                      <span>
                        Tổng:{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(order.dish.price * order.quantity * 23000)}
                      </span>
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
      <Pagination totalPages={reservationsData.totalPages} queryParams={queryParams} pathname={"/reservations"} />
    </Box>
  );
}
