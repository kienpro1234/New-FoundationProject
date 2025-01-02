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
} from "@mui/material";
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as PendingIcon,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { http } from "../../utils/http";
import { CartContext } from "../../context/cartContext";

export default function ManageReservation() {
  const [searchTerm, setSearchTerm] = useState("");
  const { userId } = useContext(CartContext);

  // Tanstack Query hook
  const {
    data: reservationsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["reservations"],
    queryFn: async () => {
      const response = await http.get(`reservations/${userId}`);
      return response.data.data;
    },
  });

  const getStatusChip = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Chip icon={<PendingIcon />} label="Pending" color="warning" />;
      case "approved":
        return <Chip icon={<CheckCircleIcon />} label="Approved" color="success" />;
      case "cancelled":
        return <Chip icon={<CancelIcon />} label="Cancelled" color="error" />;
      default:
        return <Chip label={status} />;
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Error loading reservations: {error.message}</Alert>
      </Box>
    );
  }

  const filteredReservations =
    reservationsData?.pageContent.filter(
      (row) =>
        row.fullname.toLowerCase().includes(searchTerm.toLowerCase()) || (row.phone && row.phone.includes(searchTerm)),
    ) || [];

  return (
    <Box className="!ml-[250px]" sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Quản lý đặt chỗ
      </Typography>

      <Paper sx={{ width: "100%", mb: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Tìm kiếm theo tên, số điện thoại..."
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

        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Họ tên</TableCell>
                <TableCell>Số điện thoại</TableCell>
                <TableCell>Thời gian đặt</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ghi chú</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReservations.map((row) => (
                <TableRow hover key={row.reservationId}>
                  <TableCell>{row.reservationId}</TableCell>
                  <TableCell>{row.fullname}</TableCell>
                  <TableCell>{row.phone || "N/A"}</TableCell>
                  <TableCell>{format(new Date(row.orderTime), "dd/MM/yyyy HH:mm")}</TableCell>
                  <TableCell>{row.type ? "Tại nhà hàng" : "Mang về"}</TableCell>
                  <TableCell>{getStatusChip(row.status)}</TableCell>
                  <TableCell>{row.note || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
