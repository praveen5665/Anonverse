import { ChartColumnIncreasing, House, TrendingUp } from "lucide-react";
import React from "react";
import CommunityAvatar from "./CommunityAvatar";
import { Button } from "../ui/button";
import { Link, useLocation } from "react-router-dom";

const SidebarComp = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col pt-5">
      <div className="upper flex flex-col items-start px-10 gap-2">
        <Button
          variant={location.pathname === "/" ? "default" : "ghost"}
          className="flex justify-start items-center gap-3 w-full"
          asChild
        >
          <Link to="/">
            <House /> Home
          </Link>
        </Button>
        <Button
          variant={location.pathname === "/popular" ? "default" : "ghost"}
          className="flex justify-start items-center gap-3 w-full"
          asChild
        >
          <Link to="/popular">
            <TrendingUp /> Popular
          </Link>
        </Button>
        <Button
          variant={location.pathname === "/all" ? "default" : "ghost"}
          className="flex justify-start items-center gap-3 w-full"
          asChild
        >
          <Link to="/all">
            <ChartColumnIncreasing /> All
          </Link>
        </Button>
      </div>
      <div className="separator my-4 mx-4 border-t  border-gray-300" />
      <div className="font-medium pl-4 text-lg pt-1">Top Communities</div>
      <div className="flex flex-col px-10 mt-4 gap-2">
        <Button
          className="flex justify-start items-center gap-3 w-full"
          variant="ghost"
          asChild
        >
          <Link to="/r/">
            <CommunityAvatar /> r/nsut
          </Link>
        </Button>
        <Button
          className="flex justify-start items-center gap-3 w-full"
          variant="ghost"
          asChild
        >
          <Link to="/r/">
            <CommunityAvatar /> r/gaming
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default SidebarComp;
