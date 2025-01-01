import React, { useState } from "react";
import PopUpReservation from "../PopUpReservation.jsx/PopUpReservation";
import { useQueryClient } from "@tanstack/react-query";

export default function ReservationForm({ cartItems }) {
  const [isOpen, setIsOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("user ne", user);
  const queryClient = useQueryClient();
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    // queryClient.invalidateQueries({ queryKey: ["cartList"] });
  };
  const [reservationData, setReservationData] = useState({
    date: "",
    time: "",
    name: `${user?.firstName} ${user?.lastName}`,
    phone: user?.phoneNumber,
    tables: 1,
    note: "",
  });

  const [errors, setErrors] = useState({
    phone: "",
    date: "",
    time: "",
    tables: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Chỉ kiểm tra các giới hạn cơ bản
    if (name === "time") {
      const hour = parseInt(value.split(":")[0]);
      if (hour < 6 || hour >= 22) return;
    }

    if (name === "tables") {
      if (value < 1) return;
    }

    // Cập nhật giá trị input mà không validate
    setReservationData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const formatDateTime = () => {
    if (!reservationData.date || !reservationData.time) return null;
    return new Date(`${reservationData.date}T${reservationData.time}`).toISOString();
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      phone: "",
      date: "",
      time: "",
      tables: "",
    };

    // Validate phone number
    const phoneRegex = /^\d{10,}$/;
    if (!phoneRegex.test(reservationData.phone)) {
      newErrors.phone = "Phone number must have at least 10 digits";
      isValid = false;
    }

    // Validate date
    if (!reservationData.date) {
      newErrors.date = "Date is required";
      isValid = false;
    } else {
      try {
        const selectedDate = new Date(reservationData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
          newErrors.date = "Cannot select a date in the past";
          isValid = false;
        }
      } catch (error) {
        newErrors.date = "Invalid date format";
        isValid = false;
      }
    }

    // Validate time
    if (!reservationData.time) {
      newErrors.time = "Time is required";
      isValid = false;
    }

    // Validate tables
    if (!reservationData.tables) {
      newErrors.tables = "Number of tables is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const dateTime = formatDateTime();
    const reservationPayload = {
      ...reservationData,
      dateTime,
    };
    console.log("Sending reservation data:", reservationPayload);
    handleOpen();
  };

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
      {isOpen && <PopUpReservation handleClose={handleClose} reservationData={reservationData} cartItems={cartItems} />}
      <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">Reservation</h2>
      <form onSubmit={handleSubmit}>
        {/* Name and Phone Number */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-500">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={reservationData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-500">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={reservationData.phone}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 ${
                errors.phone ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
              placeholder="Your phone"
              required
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>
        </div>

        {/* Date and Time Selection */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-semibold text-gray-700 dark:text-gray-500">
              Ngày
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={reservationData.date}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white ${
                errors.date ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
              required
            />
            {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-semibold text-gray-700 dark:text-gray-500">
              Giờ (6:00 - 22:00)
            </label>
            <input
              type="time"
              id="time"
              name="time"
              min="06:00"
              max="22:00"
              value={reservationData.time}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white ${
                errors.time ? "border-red-500" : "border-gray-300 dark:border-gray-600"
              }`}
              required
            />
            {errors.time && <p className="mt-1 text-sm text-red-500">{errors.time}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="tables" className="block text-sm font-semibold text-gray-700 dark:text-gray-500">
            Number of Tables
          </label>
          <input
            type="number"
            id="tables"
            name="tables"
            value={reservationData.tables}
            onChange={handleChange}
            min="1"
            className={`mt-1 block w-full rounded-md px-3 py-2 shadow-sm [appearance:textfield] focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
              errors.tables ? "border-red-500" : "border-gray-300 dark:border-gray-600"
            }`}
            required
          />
          {errors.tables && <p className="mt-1 text-sm text-red-500">{errors.tables}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="note" className="block text-sm font-semibold text-gray-700 dark:text-gray-500">
            Note
          </label>
          <textarea
            id="note"
            name="note"
            value={reservationData.note}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            placeholder="Additional notes"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-gray-800"
        >
          Make a Reservation
        </button>
      </form>
    </div>
  );
}
