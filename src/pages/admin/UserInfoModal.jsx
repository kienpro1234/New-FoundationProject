import React from "react";
import { useQuery } from "@tanstack/react-query";
import { http } from "../../utils/http";

export default function UserInfoModal({ userId, onClose }) {
  const { data: userInfo, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await http.get(`users/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-96 rounded-lg bg-white p-6">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const user = userInfo?.data;
  const newDob = new Date(user?.dob);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[700px] rounded-lg bg-white p-6">
        <div className="flex justify-between">
          <h3 className="mb-4 text-xl font-bold">User Information</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="flex">
          <div className="w-1/3">
            <img
              src={user?.imageUrl}
              alt={`${user?.firstName} ${user?.lastName}`}
              className="h-40 w-40 rounded-full object-cover"
            />
          </div>

          <div className="w-2/3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">{`${user?.lastName || ""} ${user?.firstName || ""}`}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Email/Phone</p>
                <p className="break-words font-medium">{user?.emailOrPhone}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">
                  {user?.dob ? `${newDob.getDate()}/${newDob.getMonth() + 1}/${newDob.getFullYear()}` : ""}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium">{user?.gender}</p>
              </div>

              <div className="col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium">{user?.address}</p>
              </div>

              <div className="col-span-2">
                <p className="text-sm text-gray-500">Roles</p>
                <div className="space-y-1">
                  {user?.roles.map((role) => (
                    <div key={role.roleId} className="mr-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-sm">
                      {role.roleName}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
