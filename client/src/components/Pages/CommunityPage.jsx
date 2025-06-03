import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCommunityByName } from "@/services/communityService";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { getPostsByCommunityId } from "@/services/postService";
import PostCard from "./PostCard";

const CommunityPage = () => {
  const { communityName } = useParams();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postError, setPostError] = useState(null);
  const [postLoading, setPostLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchCommunityAndPosts = async () => {
      try {
        setLoading(true);
        const communityResponse = await getCommunityByName(communityName);
        const communityData = communityResponse.data.data;
        setCommunity(communityData);

        const postsResponse = await getPostsByCommunityId(communityData._id);
        if (!postsResponse.data.success) {
          throw new Error(postsResponse.data.message || "Failed to load posts");
        }
        console.log("Posts fetched:", postsResponse.data.data);
        setPosts(postsResponse.data.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load data");
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
        setPostLoading(false);
      }
    };

    if (communityName) {
      fetchCommunityAndPosts();
    }
  }, [communityName]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          {/* header Skeleton */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48 rounded-md" />
                <Skeleton className="h-4 w-64 rounded-md" />
              </div>
            </div>
            <div className="flex gap-6 mt-4">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>
          </div>

          {/* rules skeleton */}

          <div className="bg-white rounded-xl shadow-sm p-6">
            <Skeleton className="h-6 w-32 mb-4 rounded-md" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-b pb-4 last:border-0">
                  <Skeleton className="h-5 w-full rounded-md" />
                  <Skeleton className="h-4 w-3/4 mt-2 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto">
          <div className="text-red-500 mb-4 text-lg font-medium">{error}</div>
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-while px-6 py-2 rounded-full transition-colors"
          >
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Community not found
          </h2>
          <p className="text-gray-600 mb-4">
            The community "r/{communityName}" doesn't exist or may have been
            removed.
          </p>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-full transition-colors"
          >
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* community header */}
      <div className="bg-gradient-to-r rounded-2xl shadow-sm p-6 mb-6 border border-gray-200 transition-all hover:shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar className="h-20 w-20 border-2 border-white shadow-md rounded-full overflow-hidden">
            <AvatarImage src={community.avatar} className="rounded-full h-full w-full flex items-center justify-center object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium rounded-full h-full w-full flex items-center justify-center">
              {community.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  r/{community.name}
                </h1>
                <p className="text-gray-700 mt-1 max-w-2xl">
                  {community.description}
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors shadow-sm">
                Join Community
              </Button>
            </div>
            {/* Community Stats */}
            <div className="flex gap-6 mt-4 text-sm text-gray-600">
              <div className="bg-white px-3 py-1.5 rounded-full shadow-inner">
                <span className="font-bold text-gray-800">
                  {community.members?.length || 0}
                </span>{" "}
                members
              </div>
              <div className="bg-white px-3 py-1.5 rounded-full shadow-inner">
                <span className="font-bold text-gray-800">
                  {community.moderators?.length || 0}
                </span>{" "}
                moderators
              </div>
              <div className="bg-white px-3 py-1.5 rounded-full shadow-inner">
                <span className="font-bold text-gray-800">
                  {new Date(community.createdAt).toLocaleDateString()}
                </span>{" "}
                created
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* main content area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Community Posts
            </h2>

            {postLoading ? (
              // Loading state
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <Skeleton className="h-40 w-full rounded-lg" />
                  </div>
                ))}
              </div>
            ) : postError ? (
              // Error state
              <div className="text-center py-8">
                <p className="text-red-500">{postError}</p>
                <Button onClick={fetchPosts} variant="outline" className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : posts.length === 0 ? (
              // Empty state
              <div className="text-center py-12">
                <p className="text-gray-500">No posts yet</p>
                <Button
                  variant="outline"
                  className="mt-4 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-full transition-colors"
                >
                  Create first post
                </Button>
              </div>
            ) : (
              // Posts list
              <div className="space-y-4">
                {posts.map((post) => (
                  <PostCard key={post._id} PostData={post} />
                ))}
              </div>
            )}
          </div>
        </div>
        {/* sidebar */}
        <div className="space-y-6">
          {/* Community Rules */}
          {community.rules && community.rules.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                    clipRule="evenodd"
                  />
                </svg>
                Community Rules
              </h2>
              <div className="space-y-4">
                {community.rules.map((rule, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-blue-200 pl-4 py-2 hover:border-blue-400 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">
                      {index + 1}.{rule.title}
                    </h3>
                    {rule.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {rule.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* moderators */}
          {community.moderators && community.moderators.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Moderators
              </h2>
              <div className="space-y-3">
                {community.moderators.map((mod, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 rounded-full overflow-hidden">
                      <AvatarImage src={mod.avatar} className="rounded-full h-full w-full object-cover" />
                      <AvatarFallback className="rounded-full h-full w-full flex items-center justify-center text-xs">
                        {mod.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700">
                      u/{mod.username}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
