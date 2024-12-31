import React, { useState } from "react";
import classes from "./Login.module.css";
import Input from "../components/UI/Input";
import ButtonLogin from "../components/UI/ButtonLogin";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { http } from "../utils/http";
import { toast } from "react-toastify";

import { getEmailOrPhoneReconfirmFromLS, getUserFromLS } from "../utils/util";
import LoadingModal from "../components/LoadingModal/LoadingModal";
export default function VerifyUser() {
  const user = getUserFromLS();
  const emailOrPhoneReconfirm = getEmailOrPhoneReconfirmFromLS();

  const [otp, setOtp] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { value } = e.target;
    setOtp(value);
  };

  // const reTakeOtpMutation = useMutation({
  //   mutationFn: async () => {
  //     return http.post("")
  //   }
  // })

  const reSendOtpMutation = useMutation({
    mutationFn: async () => {
      return http.post(`auth/resend-otp/${emailOrPhoneReconfirm}`);
    },
    onSuccess: () => {
      toast.success("Lấy lại OTP thành công, Nếu không thấy , hãy check spam email", {
        position: "top-center",
        autoClose: 3000,
      });
      navigate("/verify");
    },
    onError: (err) => {
      console.error("Lỗi otp resend trang login", err);
      toast.error("Không thể lấy mã OTP, hãy thử lại", {
        position: "top-center",
      });
    },
  });

  const useLoginWithOtpMutation = useMutation({
    mutationFn: async (otp) => {
      return http.post(
        "auth/verify-account",
        {
          emailOrPhone: emailOrPhoneReconfirm || user.phoneNumber,
          otp: otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    },
    onSuccess: () => {
      toast.success("Xác nhân tài khoản thành cong", {
        position: "top-center",
      });
      navigate("/login");
    },
    onError: (err) => {
      toast.error("Xác nhân tài khoản thất bại", {
        position: "top-center",
      });
      console.error(err);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (otp === "") {
      alert("Vui lòng nhập OTP");
      return;
    }

    useLoginWithOtpMutation.mutate(otp);
  };

  return (
    <div className={`${classes.loginContainer} `}>
      {useLoginWithOtpMutation.isPending && <LoadingModal className="translate-x-0" />}
      <form className={`${classes.loginForm} rounded-md`} onSubmit={handleSubmit}>
        <div className="flex items-center justify-between">
          <h2 className={`heading-login`}>Xác nhận tài khoản</h2>

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
        </div>
        <p className={`mb-3 mt-2`}>Lấy mã OTP trong email đăng ký</p>

        <div className={`${classes["input-password"]} mt-[12px]`}>
          <Input
            type="text"
            className={"w-full"}
            placeholder={"Nhập OTP để xác nhận tài khoản"}
            name={"otp"}
            onChange={handleChange}
            value={otp}
            required
          />
        </div>
        <div className="flex gap-4">
          {useLoginWithOtpMutation.isPending ? (
            <ButtonLogin style={{ cursor: "no-drop" }} className={"mt-3 w-full !bg-emerald-500"}>
              Xác nhận...
            </ButtonLogin>
          ) : (
            <ButtonLogin className={"mt-3 w-full !bg-emerald-500 hover:!bg-emerald-600"}>Xác nhận</ButtonLogin>
          )}
          {reSendOtpMutation.isPending ? (
            <ButtonLogin style={{ cursor: "no-drop" }} className={"mt-3 w-full"}>
              Lấy lại mã OTP...
            </ButtonLogin>
          ) : (
            <ButtonLogin type="button" onClick={() => reSendOtpMutation.mutate()} className={"mt-3 w-full"}>
              Lấy lại mã OTP
            </ButtonLogin>
          )}
        </div>
      </form>
    </div>
  );
}
