import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { MessageCircleMore, Search } from "lucide-react";
import { Link } from "react-router-dom";
import CreatePost from "./CreatePost";
import UserAvatar from "./UserAvatar";
import { useUserContext } from "@/context/AuthContext"; 

const Navbar = () => {
  const { user } = useUserContext();

  return (
    <nav className="w-full ">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="text-lg font-bold">
          Anonverse
        </Link>

        <form
          action=""
          className="flex flex-1 max-w-md items-center bg-my_bg rounded-md px-2"
        >
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="search"
            className="w-full bg-transparent p-2 focus:outline-none"
            id="site-search"
            placeholder="Search"
          />
        </form>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <button className="hover:bg-my_bg w-10 h-10 flex justify-center items-center rounded-full">
                <MessageCircleMore />
              </button>
              <CreatePost />
              <UserAvatar />
            </>
          ) : (
            <>
              <Button asChild>
                <Link to="/sign-in">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/sign-up">SignUp</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
