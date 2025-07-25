import React from "react";
import { Button } from "../ui/button";
import SearchBar from "./SearchBar";
import { MessageCircleMore, Search } from "lucide-react";
import { Link } from "react-router-dom";
import CreatePost from "./CreatePost";
import UserAvatar from "./UserAvatar";
import { useUserContext } from "@/context/AuthContext";

const Navbar = ({ onCommunityCreated }) => {
  const { user } = useUserContext();

  return (
    <nav className="w-full ">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="text-lg font-bold">
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Anonverse"
              className="w-10 h-10 rounded-full"
            />{" "}
            Anonverse
          </div>
        </Link>

        <SearchBar />

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* <button className="hover:bg-my_bg w-10 h-10 flex justify-center items-center rounded-full">
                <MessageCircleMore />
              </button> */}
              <CreatePost onCommunityCreated={onCommunityCreated} />
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
