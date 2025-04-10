import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCommunityByName } from "@/services/communityService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";

const CommunityPage = () => {
  const { communityName } = useParams();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        setLoading(true);
        const response = await getCommunityByName(communityName.toLowerCase());
        setCommunity(response.data.data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load community");
        console.error("Failed to load community:", error);
      } finally {
        setLoading(false);
      }
    };

    if (communityName) {
      fetchCommunity();
    }
  }, [communityName]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">Error: {error}</div>
        <Button
          variant="ghost"
          onClick={() => window.location.reload()}
          className="text-blue-500 hover:underline"
        >
          Try again
        </Button>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">Community not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Community Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={community.avatar} />
            <AvatarFallback>
              {community.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">
              r/{community.name.toLowerCase()}
            </h1>
            <p className="text-gray-600">{community.description}</p>
          </div>
        </div>

        {/* Community Stats */}
        <div className="flex gap-4 mt-4 text-sm text-gray-600">
          <div>
            <span className="font-bold">{community.members?.length || 0}</span>{" "}
            members
          </div>
          <div>
            <span className="font-bold">
              {community.moderators?.length || 0}
            </span>{" "}
            moderators
          </div>
        </div>
      </div>

      {/* Community Rules */}
      {community.rules && community.rules.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Community Rules</h2>
          <div className="space-y-4">
            {community.rules.map((rule, index) => (
              <div key={index} className="border-b pb-2 last:border-0">
                <h3 className="font-medium">
                  {index + 1}. {rule.title}
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
    </div>
  );
};

export default CommunityPage;
