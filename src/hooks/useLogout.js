import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginContext } from "../context/loginContext";
import { CartContext } from "../context/cartContext";

export default function useLogout() {
  const { setIsLogin } = useContext(loginContext);
  const { socket, setSocket } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    socket?.disconnect();
    setSocket(undefined);
    setIsLogin(false);
    navigate("/menu/all");
  };

  return { handleLogout, navigate };
}
