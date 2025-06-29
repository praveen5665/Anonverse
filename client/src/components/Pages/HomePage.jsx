import React, { useEffect, useState } from "react";
import { getFilteredPosts } from "@/services/postService";
import PostCard from "./PostCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PostFilter from "@/components/Common/PostFilter";
import { useUserContext } from "@/context/AuthContext";
import { Link, useLocation } from "react-router-dom";

const HomePage = ({ initialTimeFilter, initialSortFilter }) => {
  const { user } = useUserContext();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState(initialTimeFilter || "all");
  const [sortFilter, setSortFilter] = useState(initialSortFilter || "hot");

  useEffect(() => {
    setTimeFilter(initialTimeFilter || "all");
    setSortFilter(initialSortFilter || "hot");
  }, [initialTimeFilter, initialSortFilter]);

  useEffect(() => {
    // Only fetch posts if user is logged in or not on home page
    if (user || location.pathname !== "/") {
      fetchPosts();
    }
  }, [timeFilter, sortFilter, user, location.pathname]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getFilteredPosts(timeFilter, sortFilter);
      setPosts(response.data.data || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  
  const showFilter =
    location.pathname === "/popular" ||
    location.pathname === "/all" ||
    (user && location.pathname === "/");

  // Show posts if logged in or on /popular or /all
  const showPosts =
    (user && location.pathname === "/") ||
    location.pathname === "/popular" ||
    location.pathname === "/all";

  // Only show sign-in section on home page when logged out
  const showSignInSection = !user && location.pathname === "/";

  return (
    <div className="max-w-4xl mx-auto px-4 ">
      <div className="rounded-xl shadow-sm p-6 pt-0 min-w-full transition-all duration-300">
        {showSignInSection && (
          <div className="text-center py-8 mb-6">
            <h2 className="text-xl font-semibold mb-4">Welcome to Anonverse</h2>
            <p className="text-gray-600 mb-6">
              Join communities and start exploring!
            </p>
            <Button asChild>
              <Link to="/sign-in">Sign In</Link>
            </Button>
          </div>
        )}
        {showFilter && !showSignInSection && (
          <PostFilter
            timeFilter={timeFilter}
            sortFilter={sortFilter}
            onTimeFilterChange={setTimeFilter}
            onSortFilterChange={setSortFilter}
          />
        )}
        {showPosts && !showSignInSection && (
          <div className="min-h-[400px] relative mt-6">
            {loading ? (
              <div className="space-y-4 absolute w-full">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                  >
                    <Skeleton className="h-6 w-2/3 mb-4" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <Button onClick={fetchPosts} variant="outline" className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No posts found for this time period
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post._id} PostData={post} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
