// src/components/admin/ManageUsers.jsx
import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { http } from "../../utils/http";
import { toast } from "react-toastify";
import UserOrdersList from "./UserOrdersList";
import UserInfoModal from "./UserInfoModal";
import AdminNavbar from "./AdminNavbar";
import LoadingModal from "../../components/LoadingModal/LoadingModal";

export default function ManageUsers() {
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserForInfo, setSelectedUserForInfo] = useState(null);

  // Fetch users
  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await http.get("users");
      console.log("data nn", response.data);
      return response.data;
    },
  });

  let userList = [];
  if (users) {
    userList = users.data.pageContent;
  }

  const handleViewOrders = (userId) => {
    setSelectedUserId(userId);
  };

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      return http.delete(`users/${userId}`);
    },
    onSuccess: () => {
      toast.success("User deleted successfully");
      refetch(); // Refresh the users list
    },
    onError: (error) => {
      toast.error("Failed to delete user");
      console.error("Delete error:", error);
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (userData) => {
      return http.put(`users/${userData.userId}`, userData);
    },
    onSuccess: () => {
      toast.success("User updated successfully");
      setEditingUser(null); // Close edit mode
      refetch(); // Refresh the users list
    },
    onError: (error) => {
      toast.error("Failed to update user");
      console.error("Update error:", error);
    },
  });

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleEdit = (user) => {
    setEditingUser({
      ...user,
      firstName: user?.firstName,
      lastName: user?.lastName,
      imageUrl: user?.imageUrl,
      emailOrPhone: user?.emailOrPhone,
      address: user?.address,
      gender: user?.gender,
      dob: user?.dob,
    });
  };

  const handleSubmitUserEdit = () => {
    let valid = true;
    console.log("userEdit", editingUser);
    for (let key in editingUser) {
      console.log(`Key: ${key}, Value:`, editingUser[key]);
      if (editingUser[key] === "") {
        valid = false;
        toast.error("Không được bỏ trống trường nào!", { position: "top-center" });
        break;
      }
    }

    if (!valid) {
      return;
    }

    updateUserMutation.mutate(editingUser);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    updateUserMutation.mutate(editingUser);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return <div className="!ml-[250px] p-6">Loading...</div>;
  }

  return (
    <div>
      <AdminNavbar />
      <div className="ml-[240px] p-4">
        <h2 className="mb-4 text-2xl font-bold">Manage Users</h2>
        {deleteUserMutation.isPending && <LoadingModal />}
        {updateUserMutation.isPending && <LoadingModal />}
        {selectedUserForInfo && (
          <UserInfoModal userId={selectedUserForInfo} onClose={() => setSelectedUserForInfo(null)} />
        )}

        {selectedUserId && <UserOrdersList userId={selectedUserId} onClose={() => setSelectedUserId(null)} />}
        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-h-[563px] w-[700px] overflow-auto rounded-lg bg-white p-6 dark:bg-gray-800">
              <h3 className="mb-4 text-xl font-bold dark:text-gray-600">Edit User</h3>
              <form onSubmit={handleUpdate}>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium dark:text-gray-600">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={editingUser.firstName || ""}
                    onChange={handleInputChange}
                    className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium dark:text-gray-600">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={editingUser.lastName || ""}
                    onChange={handleInputChange}
                    className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium dark:text-gray-600">Image URL</label>
                  <input
                    type="text"
                    name="imageUrl"
                    value={editingUser.imageUrl || ""}
                    onChange={handleInputChange}
                    className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium dark:text-gray-600">Email/Phone</label>
                  <input
                    type="text"
                    name="emailOrPhone"
                    value={editingUser.emailOrPhone || ""}
                    onChange={handleInputChange}
                    className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-1 block text-sm font-medium dark:text-gray-600">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={editingUser.address || ""}
                    onChange={handleInputChange}
                    className="w-full rounded border p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <span className="block text-lg font-medium text-gray-700 dark:text-gray-600">Giới tính:</span>
                  <div className="mt-2 flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={editingUser.gender === "Male"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-blue-600 dark:bg-gray-700"
                      />
                      <span className="dark:text-gray-600">Nam</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={editingUser.gender === "Female"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-pink-600 dark:bg-gray-700"
                      />
                      <span className="dark:text-gray-600">Nữ</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="gender"
                        value="Other"
                        checked={editingUser.gender === "Other"}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-gray-600 dark:bg-gray-700"
                      />
                      <span className="dark:text-gray-600">Khác</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label htmlFor="date" className="block text-lg font-medium text-gray-700 dark:text-gray-600">
                    Chọn ngày:
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="dob"
                    value={editingUser.dob}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitUserEdit}
                    type="button"
                    className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-lg bg-white shadow-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Contact
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {userList?.map((user) => (
                <tr key={user.userId}>
                  <td
                    onClick={() => setSelectedUserForInfo(user.userId)}
                    className="cursor-pointer whitespace-nowrap px-6 py-4 text-blue-600 hover:text-blue-900"
                  >
                    {`${user.lastName || ""} ${user.firstName || ""}`} {!user.lastName && !user.firstName && "Guest"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{user.emailOrPhone}</td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {user.roles?.map((role) => (
                      <div key={role.roleName} className="whitespace-nowrap">
                        {role.roleName}
                      </div>
                    ))}
                  </td>
                  <td className="space-x-3 whitespace-nowrap px-6 py-4">
                    <button
                      onClick={() => handleViewOrders(user.userId)}
                      className="text-green-600 hover:text-green-900"
                    >
                      View Orders
                    </button>
                    <button onClick={() => handleEdit(user)} className="mr-3 text-blue-600 hover:text-blue-900">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(user.userId)} className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
