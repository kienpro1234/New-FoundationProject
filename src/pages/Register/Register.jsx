import React, { useState } from "react";
import classes from "./Register.module.css";
import Input from "../../components/UI/Input";
import ButtonLogin from "../../components/UI/ButtonLogin";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { http } from "../../utils/http";

import { toast } from "react-toastify";
import { isPhoneNumber } from "../../utils/util";

export default function Register() {
  const [eyeOpen, setEyeOpen] = useState(true);
  const [userData, setUserData] = useState({
    surname: "",
    fullname: "",
    password: "",
    phoneNumber: "",
    confirmedPassword: "",
    email: "",
  });
  const navigate = useNavigate();

  const [dataError, setDataError] = useState({
    surname: "",
    fullname: "",
    password: "",
    confirmedPassword: "",
    phoneNumber: "",
    email: "",
  });

  // let phoneNumber = isPhoneNumber(userData.account) ? userData.account : "";
  // let email = isEmail(userData.account) ? userData.account : "";

  const useRegisterMutation = useMutation({
    mutationFn: (userData) => {
      try {
        return http.post(`auth/register`, {
          firstName: userData.surname,
          lastName: userData.fullname,
          phoneNumber: userData.phoneNumber,
          email: userData.email,
          gender: "",
          password: userData.password,
          dob: "",
          address: "",
        });
      } catch (error) {
        console.log("error roi", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      setUserData({
        surname: "",
        fullname: "",
        account: "",
        password: "",
        confirmedPassword: "",
      });
      localStorage.setItem("user", JSON.stringify(data.data.data));
      toast.success("Register successfully", {
        position: "top-center",
      });
      navigate("/verify");
    },
    onError: (error) => {
      toast.error(`${error.response?.data?.message}`, {
        position: "top-center",
        autoClose: 3000,
      });
      console.error("Error:", error);
      // Xử lý lỗi và giữ lại dữ liệu form nếu đăng ký thất bại
    },
  });

  const validateName = (name, value) => {
    const nameRegex =
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểễếỄỆỉỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ\s]+$/;
    if (value === "") {
      if (name === "surname") {
        setDataError({
          ...dataError,
          [name]: "Surname must not be left blank",
        });
      } else {
        setDataError({
          ...dataError,
          [name]: "Surname must not be left blank",
        });
      }
    }
    if (!nameRegex.test(value)) {
      if (name === "surname") {
        setDataError({
          ...dataError,
          surname: "Name is not valid",
        });
      } else {
        setDataError({
          ...dataError,
          fullname: "Name is not valid",
        });
      }
    } else {
      setDataError({
        ...dataError,
        [name]: "",
      });
    }
  };

  // const validateAccount = (name, value) => {
  //   console.log("name regex", name);
  //   const emailRegex =
  //     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|^[0-9]+$/;
  //   const phoneNumberRegex = /^\d{10,}$/;
  //   if (value === "") {
  //     setDataError({
  //       ...dataError,
  //       [name]: "This field must not be left blank",
  //     });
  //   }

  //   if (isPhoneNumber(value)) {
  //     console.log("isPhoneNumber");
  //     if (!phoneNumberRegex.test(value)) {
  //       setDataError({
  //         ...dataError,
  //         [name]: "PhoneNumber must have at least 10 number",
  //       });
  //     } else {
  //       setDataError({
  //         ...dataError,
  //         [name]: "",
  //       });
  //     }
  //   } else {
  //     if (!emailRegex.test(value)) {
  //       setDataError({
  //         ...dataError,
  //         [name]: "Email is not valid",
  //       });
  //     } else {
  //       setDataError({
  //         ...dataError,
  //         [name]: "",
  //       });
  //     }
  //   }
  // };

  const validateEmail = (name, value) => {
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.\".+\")@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value === "") {
      return "This field must not be left blank";
    } else if (!emailRegex.test(value)) {
      setDataError({
        ...dataError,
        [name]: "Email is not valid",
      });
    } else {
      setDataError({
        ...dataError,
        [name]: "",
      });
    }
  };

  const validatePhoneNumber = (name, value) => {
    const phoneNumberRegex = /^\d{10,}$/;
    if (value === "") {
      return "This field must not be left blank";
    } else if (!phoneNumberRegex.test(value)) {
      setDataError({
        ...dataError,
        [name]: "PhoneNumber must have at least 10 number",
      });
    } else {
      setDataError({
        ...dataError,
        [name]: "",
      });
    }
  };

  const validatePassword = (name, value) => {
    if (value === "") {
      setDataError({
        ...dataError,
        [name]: "Password must not be left blank",
      });
    } else {
      setDataError({
        ...dataError,
        [name]: "",
      });
    }
  };

  const validateConfirmedPassword = (name, value) => {
    if (value !== userData.password) {
      setDataError((prevDataError) => {
        return {
          ...prevDataError,
          [name]: "Confirmed password must be the same as password",
        };
      });
    } else {
      setDataError({
        ...dataError,
        [name]: "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
    if (name === "surname" || name === "fullname") validateName(name, value);
    if (name === "email") validateEmail(name, value);
    if (name === "phoneNumber") validatePhoneNumber(name, value);
    if (name === "password") validatePassword(name, value);
    if (name === "confirmedPassword") validateConfirmedPassword(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;

    for (const key in dataError) {
      if (dataError[key]) {
        console.log("có lỗi trong này");
        isValid = false;
        break;
      }
    }

    for (const key in userData) {
      if (userData[key] === "") {
        console.log("Lỗi data bị trống");
        isValid = false;
        break;
      }
    }
    if (!isValid) {
      alert("Vui lòng nhập đúng thông tin yêu cầu");
      return;
    }

    useRegisterMutation.mutate(userData);
  };
  return (
    <div className={`${classes.loginContainer} `}>
      <form noValidate className={`${classes.loginForm} rounded-md`} onSubmit={handleSubmit}>
        <h2 className={`heading-login`}>Đăng Kí</h2>
        <p className={`mb-3 mt-2`}>Đăng kí bằng email hoặc số điện thoại</p>

        {/* input */}
        <div className="mb-[12px]">
          <Input
            className={"w-full"}
            placeholder={"Họ của bạn"}
            name="surname"
            onChange={handleChange}
            value={userData.surname}
          />
          <div className={`${classes.error}`}>{dataError.surname}</div>
        </div>
        <div className="mb-[12px]">
          <Input
            className={"w-full"}
            placeholder={"Tên của bạn"}
            name="fullname"
            onChange={handleChange}
            value={userData.fullname}
          />
          <div className={`${classes.error} `}>{dataError.fullname}</div>
        </div>
        <div className="mb-[12px]">
          <Input
            className={"w-full"}
            placeholder={"Số điện thoại"}
            name="phoneNumber"
            type="tel"
            onChange={handleChange}
            value={userData.phoneNumber}
          />
          <div className={`${classes.error} `}>{dataError.phoneNumber}</div>
        </div>

        <div className="mb-[12px]">
          <Input
            className={"w-full"}
            placeholder={"Email"}
            name="email"
            type="email"
            onChange={handleChange}
            value={userData.email}
          />
          <div className={`${classes.error} `}>{dataError.email}</div>
        </div>
        <div className={`${classes["input-password"]}`}>
          <Input
            type={eyeOpen ? "password" : "text"}
            className={"w-full"}
            placeholder={"Mật khẩu"}
            name="password"
            onChange={handleChange}
            value={userData.password}
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
        <div className={`${classes.error} mb-[12px]`}>{dataError.password}</div>
        <div className="">
          <Input
            type={"password"}
            className={"w-full"}
            placeholder={"Nhập lại mật khẩu"}
            name="confirmedPassword"
            onChange={handleChange}
            value={userData.confirmedPassword}
          />
        </div>
        <div className={`${classes.error} `}>{dataError.confirmedPassword}</div>
        {/* Nhớ tài khoản , quên mk */}
        <div className="flex items-baseline justify-between">
          <div className="mt-3 flex items-baseline gap-2">
            <input id="login-input" type="checkbox" className="basis-[10%] accent-emerald-500" name="agreeTerm" />
            <label className="text-sm" htmlFor="login-input">
              Tôi đồng ý với{" "}
              <span className="text-red-500">điều kiện & điều khoản sử dụng thông tin của tasty chicken</span>
            </label>
          </div>
        </div>
        <div>
          {useRegisterMutation.isPending ? (
            <ButtonLogin disabled className={"mb-2 mt-2 w-full cursor-no-drop 2xl:mb-3 2xl:mt-3"}>
              Sending...
            </ButtonLogin>
          ) : (
            <ButtonLogin className={"mb-2 mt-2 w-full 2xl:mb-3 2xl:mt-3"}>ĐĂNG KÍ</ButtonLogin>
          )}
        </div>
        <div className="text-sm">
          <span>
            <span className="mr-2">Bạn đã có tài khoản?</span>
            <Link to={"/login"} className="text-red-500 hover:text-red-700" href="#">
              Đăng nhập ngay
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
