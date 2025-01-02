import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { http } from "../../utils/http";
import AdminNavbar from "./AdminNavbar";
import { CartContext } from "../../context/cartContext";
import { toast } from "react-toastify";

const fetchTables = async () => {
  console.log("fetching tables");
  const response = await http.get("positions");
  return response.data.data;
};

const fetchOrdersByPosition = async (positionId) => {
  const response = await http.get(`orders/position/${positionId}`);
  return response.data.data.pageContent;
};

const TableOrders = () => {
  const { socket } = useContext(CartContext);
  const [selectedTable, setSelectedTable] = useState(null);

  // Query for fetching tables
  const {
    data: tables = [],
    isLoading: isTablesLoading,
    error: tablesError,
  } = useQuery({
    queryKey: ["tables"],
    queryFn: fetchTables,
  });

  useEffect(() => {
    if (tables.length > 0) {
      console.log("hey it's here");
      if (!selectedTable && tables.length > 0) {
        console.log("positionId", setSelectedTable(tables[0].positionId));
        setSelectedTable(tables[0].positionId);
      }
    }
  }, [tables.length]);

  // useEffect(() => {
  //   if (socket?.connected) {
  //     onConnect();
  //   }

  //   function onConnect() {}

  //   function onDisconnect() {}

  //   // function onNewOrder(order) {
  //   //   toast.success(`New order from ${order.user.emailOrPhone}`);
  //   //   refetchOrders();
  //   // }

  //   socket?.on("connect", onConnect);
  //   socket?.on("disconnect", onDisconnect);
  //   // socket?.on("newOrder", onNewOrder);

  //   return () => {
  //     socket?.off("connect", onConnect);
  //     socket?.off("disconnect", onDisconnect);
  //     // socket?.off("confirmOrder", onNewOrder);
  //   };
  // }, []);

  console.log("selectedtable", selectedTable);

  // Query for fetching orders of selected table
  const {
    data: orders = [],
    isLoading: isOrdersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ["orders", selectedTable],
    queryFn: () => fetchOrdersByPosition(selectedTable),
    enabled: !!selectedTable, // Only fetch when a table is selected
  });

  if (isTablesLoading) return <div className="!ml-[250px] p-6">Loading tables...</div>;
  if (tablesError) return <div className="!ml-[250px] p-6">Error loading tables: {tablesError.message}</div>;

  return (
    <div>
      <AdminNavbar />
      <div className="!ml-[240px] p-4">
        {/* Tables Navigation */}
        <div className="mb-6 flex gap-4 overflow-x-auto">
          {tables.map((table) => (
            <button
              key={table.positionId}
              onClick={() => setSelectedTable(table.positionId)}
              className={`rounded-lg px-4 py-2 capitalize ${
                selectedTable === table.positionId ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {table.positionName}
            </button>
          ))}
        </div>

        {/* Orders Display */}
        {isOrdersLoading ? (
          <div>Loading orders...</div>
        ) : ordersError ? (
          <div>Error loading orders: {ordersError.message}</div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div key={order.orderId} className="rounded-lg border p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold">{order.dish.dishName}</h3>
                    <p>Quantity: {order.quantity}</p>
                    <p>Cooking Time: {order.timeServing} mins</p>
                    <p>Total Price: ${order.totalPrice}</p>
                    <p
                      className={`inline rounded-full px-2 py-1 text-xs ${order.orderStatus ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                    >
                      Status: {order.orderStatus ? "Confirmed" : "Pending"}
                    </p>
                  </div>
                  <img src={order.dish.image} alt={order.dish.dishName} className="size-32 rounded object-cover" />
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Customer: {`${order.user.firstName} ${order.user.lastName}`}</p>
                  <p>Table: {order.position.positionName}</p>
                </div>
              </div>
            ))}
            {orders.length === 0 && <div className="text-center text-gray-500">No orders for this table</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default TableOrders;
