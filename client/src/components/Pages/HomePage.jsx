import React, { useEffect, useState } from "react";
import { getFilteredPosts } from "@/services/postService";
import PostCard from "./PostCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PostFilter from "@/components/Common/PostFilter";

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("hot");

  useEffect(() => {
    fetchPosts();
  }, [timeFilter, sortFilter]);

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

  return (
    <div className="max-w-4xl mx-auto px-4 ">
      <div className="rounded-xl shadow-sm p-6 pt-0 min-w-full transition-all duration-300">
        <PostFilter
          timeFilter={timeFilter}
          sortFilter={sortFilter}
          onTimeFilterChange={setTimeFilter}
          onSortFilterChange={setSortFilter}
        />

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
      </div>
    </div>
  );
};

export default HomePage;
