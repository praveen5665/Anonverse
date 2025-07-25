import { ChartColumnIncreasing, House, TrendingUp } from "lucide-react";
import React, { useState, useEffect } from "react";
import CommunityAvatar from "./CommunityAvatar";
import { Button } from "../ui/button";
import { Link, useLocation } from "react-router-dom";
import { getTopCommunities } from "@/services/communityService";
import { Skeleton } from "@/components/ui/skeleton";

const SidebarComp = ({ refreshTrigger }) => {
  const location = useLocation();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTopCommunities = async () => {
    setLoading(true);
    try {
      const data = await getTopCommunities(10); // Fetch top 10 communities
      // Sort communities by member count in descending order
      const sortedCommunities = data.sort((a, b) => {
        const aMemberCount = a.members ? a.members.length : 0;
        const bMemberCount = b.members ? b.members.length : 0;
        return bMemberCount - aMemberCount;
      });
      setCommunities(sortedCommunities);
    } catch (error) {
      console.error("Error fetching top communities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopCommunities();
  }, []);

  // Refresh communities when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchTopCommunities();
    }
  }, [refreshTrigger]);

  return (
    <div className="flex flex-col pt-5 sticky top-0 h-screen overflow-y-auto">
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
      <div className="separator my-4 mx-4 border-t  border-gray-300" />{" "}
      <div className="font-medium pl-4 text-lg pt-1">Top Communities</div>
      <div className="flex flex-col px-10 mt-4 gap-2">
        {loading ? (
          // Loading skeletons for top 10 communities
          Array(10)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))
        ) : communities.length > 0 ? (
          communities.map((community) => (
            <Button
              key={community._id}
              className="flex justify-start items-center gap-3 w-full"
              variant="ghost"
              asChild
            >
              <Link to={`/r/${community.name}`}>
                <CommunityAvatar
                  avatar={community.avatar}
                  name={community.name}
                />
                <span className="flex-1">r/{community.name}</span>
              </Link>
            </Button>
          ))
        ) : (
          <div className="text-gray-500 text-sm px-2">No communities found</div>
        )}
      </div>
    </div>
  );
};

export default SidebarComp;
