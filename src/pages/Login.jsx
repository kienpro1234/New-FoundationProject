import React, { useContext, useState } from "react";
import classes from "./Login.module.css";
import Input from "../components/UI/Input";
import ButtonLogin from "../components/UI/ButtonLogin";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { http } from "../utils/http";
import { toast } from "react-toastify";
import { CartContext } from "../context/cartContext";
import { getUserFromLS, setEmailOrPhoneReconfirmToLS } from "../utils/util";
import { io } from "socket.io-client";

export default function Login() {
  const user = getUserFromLS();
  const { socket, setSocket } = useContext(CartContext);
  const [eyeOpen, setEyeOpen] = useState(true);
  const [noVerify, setNoverify] = useState(false);
  const initialUserData = {
    account: "",
    password: "",
  };

  const [userData, setUserData] = useState(initialUserData);
  const { setUserId } = useContext(CartContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const reSendOtpMutation = useMutation({
    mutationFn: async () => {
      return http.post(`auth/resend-otp/${userData.account}`);
    },
    onSuccess: () => {
      navigate("/verify");
    },
    onError: (err) => {
      console.error("Lỗi otp resend trang login", err);
    },
  });

  const useLoginMutation = useMutation({
    mutationFn: async (userData) => {
      return http.post(
        "auth/login",
        {
          emailOrPhone: userData.account,
          password: userData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    },
    onSuccess: (data) => {
      console.log("data nnn", data);
      const accessToken = data.data.accessToken;
      const userId = data.data.user.userId;
      // console.log("accessToken", accessToken);
      // console.log("userId", userId);
      const role = data.data.user.roles.length > 1 ? "admin" : "user";

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("userId", userId);
        localStorage.setItem("role", role);
        setUserId(userId);
        // setSocket(io("https://restaurant-ordering-webapp-0-7-7-release.onrender.com"));
      }

      setUserData(initialUserData);
      toast.success("Đăng nhập thành công", {
        position: "top-center",
      });
      navigate("/menu/all");
    },

    onError: (err) => {
      // toast.error(`Login failed - Account or password is not correct`, {
      //   position: "top-center",
      // });

      if (err.response.data.code === 1017) {
        toast.error(err.response.data.message, {
          position: "top-center",
        });
        setEmailOrPhoneReconfirmToLS(userData.account);
        setNoverify(true);
      } else {
        toast.error("Login failed", {
          position: "top-center",
        });
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    let isValid = true;
    for (const key in userData) {
      if (userData[key] === "") {
        isValid = false;
        break;
      }
    }

    if (!isValid) {
      alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu");
      return;
    }

    useLoginMutation.mutate(userData);
  };

  return (
    <div className={`${classes.loginContainer} `}>
      <form className={`${classes.loginForm} rounded-md`} onSubmit={handleSubmit}>
        <h2 className={`heading-login`}>Đăng nhập</h2>
        <p className={`mb-3 mt-2`}>Đăng nhập bằng email hoặc số điện thoại</p>
        {/* input */}
        <div className="mb-[12px]">
          <Input
            className={"w-full"}
            placeholder={"Email hoặc số điện thoại"}
            name={"account"}
            onChange={handleChange}
            value={userData.account}
            required
          />
        </div>
        <div className={`${classes["input-password"]}`}>
          <Input
            type={eyeOpen ? "password" : "text"}
            className={"w-full"}
            placeholder={"Mật khẩu"}
            name={"password"}
            onChange={handleChange}
            value={userData.password}
            required
          />
          <button
            type="button"
            onClick={() => {
              setEyeOpen((prevEyeOpen) => !prevEyeOpen);
            }}
          >
            {eyeOpen ? <i className="fa fa-eye text-gray-400"></i> : <i className="fa fa-eye-slash text-gray-400"></i>}
          </button>
        </div>

        {/* Nhớ tài khoản , quên mk */}
        <div className="flex items-baseline justify-between">
          <div className="mt-3 flex items-baseline gap-2">
            <input id="login-input" type="checkbox" className="accent-emerald-500" />
            <label className="text-sm" htmlFor="login-input">
              Nhớ tài khoản
            </label>
          </div>
          <a className="cursor-pointer text-sm font-normal text-gray-600 underline decoration-1 underline-offset-4 hover:text-gray-600">
            Quên mật khẩu?
          </a>
        </div>
        <div>
          {useLoginMutation.isPending ? (
            <ButtonLogin style={{ cursor: "no-drop" }} className={"mt-3 w-full"}>
              Đăng nhập...
            </ButtonLogin>
          ) : (
            <ButtonLogin className={"mt-3 w-full"}>Đăng nhập</ButtonLogin>
          )}
        </div>
        <div className="mt-3 flex justify-between text-sm">
          <Link to={"/menu"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 transition hover:fill-blue-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </Link>
          {/* fda */}
          <span>
            <span className="mr-2">Bạn chưa có tài khoản?</span>
            <Link to={"/register"} className="text-red-500 hover:text-red-700" href="#">
              Đăng kí ngay
            </Link>
          </span>
          {noVerify && !reSendOtpMutation.isPending && (
            <span>
              <span
                to={"/verify"}
                className="cursor-pointer text-nowrap text-red-500 hover:text-red-700"
                href="#"
                onClick={() => {
                  reSendOtpMutation.mutate();
                }}
              >
                Xác nhận tài khoản
              </span>
            </span>
          )}
          {noVerify && reSendOtpMutation.isPending && (
            <span>
              <span to={"/verify"} className="text-nowrap text-red-500 hover:text-red-700" href="#">
                Đang chuyển hướng...
              </span>
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
