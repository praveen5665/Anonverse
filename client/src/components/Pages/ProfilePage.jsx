import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PostCard from "./PostCard";
import PostFilter from "@/components/Common/PostFilter";
import { getFilteredPosts } from "@/services/postService";
import {
  getUserProfile,
  updateUserProfile,
  getUserStats,
} from "@/services/userService";
import { useUserContext } from "@/context/AuthContext";

const ProfilePage = () => {
  const { username } = useParams();
  const { user: currentUser } = useUserContext();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postLoading, setPostLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("all");
  const [sortFilter, setSortFilter] = useState("hot");
  const [editMode, setEditMode] = useState(false);
  const [editBio, setEditBio] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [editAvatarFile, setEditAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await getUserProfile(username);
        setUser(response);
        setEditBio(response.bio || "");
        setEditAvatar(response.avatar || "");
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
        const response = await getFilteredPosts(timeFilter, sortFilter, {
          author: username,
        });
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getUserStats(username);
        setStats(data);
      } catch (error) {
        setStats(null);
      }
    };
    fetchStats();
  }, [username]);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditBio(user.bio || "");
    setEditAvatar(user.avatar || "");
    setEditAvatarFile(null);
  };

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditAvatarFile(file);
      setEditAvatar(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let data;
      if (editAvatarFile) {
        data = new FormData();
        data.append("bio", editBio);
        data.append("avatar", editAvatarFile);
      } else {
        data = { bio: editBio, avatar: editAvatar };
      }
      const updated = await updateUserProfile(data);
      setUser(updated.user);
      setEditMode(false);
      setEditAvatarFile(null);
    } catch (error) {
      // Optionally show error
    } finally {
      setSaving(false);
    }
  };

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

  const isOwner = currentUser && currentUser.username === user.username;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24 border-2 border-white shadow-md rounded-full overflow-hidden">
            <AvatarImage
              src={editMode ? editAvatar : user.avatar}
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
              {isOwner && !editMode && (
                <Button variant="outline" onClick={handleEdit}>
                  Edit Profile
                </Button>
              )}
            </div>
            <div className="text-gray-600">
              <p>
                Member since {new Date(user.joinedDate).toLocaleDateString()}
              </p>
              {editMode ? (
                <>
                  <div className="mt-2">
                    <label className="block text-sm font-medium">Bio</label>
                    <textarea
                      className="w-full border rounded p-2 mt-1"
                      rows={3}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                    />
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium">
                      Avatar Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full border rounded p-2 mt-1"
                      onChange={handleAvatarFileChange}
                    />
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium">
                      Or Avatar URL
                    </label>
                    <input
                      className="w-full border rounded p-2 mt-1"
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      disabled={!!editAvatarFile}
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {user.bio && <p className="mt-2">{user.bio}</p>}
                  <div className="mt-2 flex gap-6 text-sm text-gray-500">
                    {stats && (
                      <>
                        <span>
                          Posts: <b>{stats.postCount}</b>
                        </span>
                        <span>
                          Comments: <b>{stats.commentCount}</b>
                        </span>
                        <span>
                          Communities: <b>{stats.joinedCommunities}</b>
                        </span>
                      </>
                    )}
                  </div>
                </>
              )}
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
