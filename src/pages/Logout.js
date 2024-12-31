// import { useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginContext } from "../context/loginContext";

// export function Logout() {
//   const { setIsLogin } = useContext(loginContext);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (localStorage.getItem("accessToken")) {
//       localStorage.removeItem("accessToken");
//       setIsLogin(false);
//       navigate("/menu/all");
//     }
//   }, [navigate, setIsLogin]);

//   return null;
// }
