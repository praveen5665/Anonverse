import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserContext } from "@/context/AuthContext"; 
import { Link, useNavigate } from "react-router-dom";

const UserAvatar = () => {
  const { user, logout } = useUserContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate("/"); 
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="focus:outline-none">
          <Avatar>
            <AvatarImage src={user?.avatar || ""} alt={user?.username || "User"} />
            <AvatarFallback>{user?.username?.slice(0, 2).toUpperCase() || "AN"}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="bg-white shadow-md rounded-md p-2 mt-2 min-w-[150px] dark:bg-gray-800"
        side="bottom"
        align="end"
      >
        <DropdownMenu.Item className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          {"u/" + user?.username || "Guest"}
        </DropdownMenu.Item>

        <DropdownMenu.Item className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
        <Link to={`/u/${user?.username}`}>Profile</Link>
        </DropdownMenu.Item>

        <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-600 my-2" />

        <DropdownMenu.Item
          className="px-4 py-2 text-sm hover:bg-red-100 dark:hover:bg-red-700 text-red-600 dark:text-red-400 cursor-pointer"
          onSelect={handleLogout}
        >
          Logout
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default UserAvatar;
