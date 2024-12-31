import React from "react";
import { NavLink } from "react-router-dom";

export default function AdminNavbar() {
  return (
    <nav className="ml-[240px] bg-white p-4">
      <div className="flex space-x-4">
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `rounded-md px-3 py-2 text-sm font-medium ${
              isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`
          }
        >
          Manage Users
        </NavLink>
        <NavLink
          to="/admin/payments"
          className={({ isActive }) =>
            `rounded-md px-3 py-2 text-sm font-medium ${
              isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`
          }
        >
          Manage Payments
        </NavLink>

        <NavLink
          to="/admin/tables"
          className={({ isActive }) =>
            `rounded-md px-3 py-2 text-sm font-medium ${
              isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`
          }
        >
          Manage Tables
        </NavLink>
      </div>
    </nav>
  );
}
