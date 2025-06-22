import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PostCard from "./PostCard";
import PostFilter from "@/components/Common/PostFilter";
import { getFilteredPosts } from "@/services/postService";
import { getUserProfile } from "@/services/userService";

const ProfilePage = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("hot");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(username);
        setUser(response);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setPostLoading(true);
        const response = await getFilteredPosts({
          author: username,
          timeFilter,
          sortFilter,
        });
        console.log("Fetched posts:", response);
        setPosts(response.data.data || []);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      } finally {
        setPostLoading(false);
      }
    };

    if (username) {
      fetchUserPosts();
    }
  }, [username, timeFilter, sortFilter]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-6 mb-8">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">User not found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24 border-2 border-white shadow-md rounded-full overflow-hidden">
            <AvatarImage
              src={user.avatar}
              className="h-full w-full object-cover"
              alt={user.username}
            />
            <AvatarFallback className="bg-gradient-to-br from-orange-300 to-orange-400 text-white text-xl font-medium">
              {user.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">u/{user.username}</h1>
              {/* {currentUser?.id === user._id && (
                <Button variant="outline">Edit Profile</Button>
              )} */}
            </div>
            <div className="text-gray-600">
              <p>
                Member since{" "}
                {new Date(user.joinedDate).toLocaleDateString()}
              </p>
              {user.bio && <p className="mt-2">{user.bio}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Posts</h2>
          <PostFilter
            timeFilter={timeFilter}
            sortFilter={sortFilter}
            onTimeFilterChange={setTimeFilter}
            onSortFilterChange={setSortFilter}
          />
        </div>

        {postLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} PostData={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">No posts yet</div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;