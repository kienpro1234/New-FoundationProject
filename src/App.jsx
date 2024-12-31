import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import UserInfo from "./pages/UserInfo/UserInfo";
import Root from "./pages/Root";
import About from "./pages/About";
import Menu from "./pages/Menu";
import Contact from "./pages/Contact";
import MenuDetails from "./pages/MenuDetails";
import { getToken, isEmail, queryClient } from "./utils/util";
import { QueryClientProvider } from "@tanstack/react-query";
import FoodDetail from "./pages/FoodDetail";
import MenuDetailError from "./pages/MenuDetailError";
import { SearchingContextProvider } from "./context/headerContext";
import Login from "./pages/Login";
import Register from "./pages/Register/Register";
import { LoginContextProvider } from "./context/loginContext";
import ShoppingCart from "./pages/ShoppingCart/ShoppingCart";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Table from "./pages/Table/Table";
import { CartContextProvider } from "./context/cartContext";
import { DOMAIN } from "./utils/const";
import FavFood from "./pages/FavFood/FavFood";
import FavContextProvider from "./context/favContext";
import { UserContextProvider } from "./context/userContext";
import ManageUsers from "./pages/admin/ManageUsers";
import Bill from "./pages/Bill/Bill";
import PaymentsList from "./pages/admin/ManagePayments";
import ManageTable from "./pages/admin/ManageTables";
import VerifyUser from "./pages/VerifyUser";

function RejectedRoute() {
  const token = getToken();
  return !token ? <Outlet /> : <Navigate to={"/menu"} />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/admin",

        children: [
          {
            index: true,
            element: <Navigate to={"/admin/users"} />,
          },
          {
            path: "/admin/payments",
            element: <PaymentsList />,
          },
          {
            path: "/admin/users",
            element: <ManageUsers />,
          },
          {
            path: "/admin/tables",
            element: <ManageTable />,
          },
        ],
      },
      {
        index: true,
        // path: "/home",
        element: <Home />,
      },
      {
        path: "/fav",
        element: <FavFood />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/menu",
        element: <Menu />,
        children: [
          { index: true, element: <Navigate to={"/menu/all"} /> },
          {
            path: "/menu/:id",
            element: <MenuDetails />,
            errorElement: <MenuDetailError />,
          },
        ],
      },

      {
        path: "/food/:id",
        element: <FoodDetail />,
        errorElement: <MenuDetailError />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
    ],
  },
  {
    path: "/userinfo",
    element: <UserInfo />,
  },
  {
    path: "/",
    element: <RejectedRoute />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },

  {
    path: "/verify",
    element: <VerifyUser />,
  },
  {
    path: "/bill/:paymentId",
    element: <Bill />,
  },
  {
    path: "/cart",
    element: <ShoppingCart />,
  },
  {
    path: `/api/positions/:tableId`,
    element: <Table />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchingContextProvider>
        <LoginContextProvider>
          <CartContextProvider>
            <FavContextProvider>
              <UserContextProvider>
                <RouterProvider router={router} />
              </UserContextProvider>
            </FavContextProvider>
          </CartContextProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </LoginContextProvider>
      </SearchingContextProvider>
    </QueryClientProvider>
  );
}

export default App;
