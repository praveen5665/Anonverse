import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { formatDistanceToNow } from "date-fns";
import { handleVote as handleVoteAPI } from "@/services/postService";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const PostCard = ({ PostData, isPostPage, onCommentClick }) => {
  const [imageLoading, setImageLoading] = useState(true);

  if (!PostData) return null;

  const {
    title = "",
    content = "",
    image = "",
    upVotes = [],
    downVotes = [],
    comments = [],
    createdAt,
    author = {},
    community = {},
  } = PostData;

  const authorUsername = author?.username || "unknown";
  const communityName = community?.name || "unknown";

  const { user, token } = useUserContext();
  const navigate = useNavigate();

  const [userVote, setUserVote] = useState(
    upVotes.includes(user?.id)
      ? "up"
      : downVotes.includes(user?.id)
      ? "down"
      : null
  );

  const [votes, setVotes] = useState({
    upVotes: upVotes.length || 0,
    downVotes: downVotes.length || 0,
  });

  useEffect(() => {
    if (!user?.id) return;

    const userId = String(user.id);
    const upVoteIds = upVotes.map((id) => String(id));
    const downVoteIds = downVotes.map((id) => String(id));

    if (upVoteIds.includes(userId)) {
      setUserVote("up");
    } else if (downVoteIds.includes(userId)) {
      setUserVote("down");
    } else {
      setUserVote(null);
    }
  }, [user, upVotes, downVotes]);

  const handleVoteClick = async (voteType) => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    try {
      // Make API call
      const result = await handleVoteAPI(PostData._id, voteType, userVote);

      setUserVote(userVote === voteType ? null : voteType);
      setVotes({
        upVotes: result.upVotes,
        downVotes: result.downVotes,
      });
    } catch (error) {
      console.error("Error while voting:", error);
    }
  };

  const handleCommentClick = (e) => {
    e.preventDefault();
    if (isPostPage && onCommentClick) {
      onCommentClick();
    } else {
      navigate(`/post/${PostData._id}`);
    }
  };

  const handleShareClick = () => {
    const postUrl = `${window.location.origin}/post/${PostData._id}`;
    navigator.clipboard.writeText(postUrl);
    toast.success("Link copied to clipboard!", {
      duration: 1300,
    });
  };

  const handleCardClick = () => {
    if (!isPostPage) {
      navigate(`/post/${PostData._id}`);
    }
  };

  const handleActionClick = (e) => {
    e.stopPropagation(); // Prevent card click when clicking buttons
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors"
    >
      <div className="text-sm text-gray-500 mb-2" onClick={handleActionClick}>
        <Link
          to={`/r/${communityName}`}
          className="hover:underline font-medium"
        >
          r/{communityName}
        </Link>
        <span className="mx-1">•</span>
        <span>Posted by </span>
        <Link to={`/u/${authorUsername}`} className="hover:underline">
          u/{authorUsername}
        </Link>
        <span className="mx-1">•</span>
        <span>{formatDistanceToNow(new Date(createdAt))} ago</span>
      </div>

      {/* Post content */}

      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      {image && (
        <div className="relative mb-4 max-h-[512px] overflow-hidden rounded-lg">
          {imageLoading && <Skeleton className="w-full h-64 rounded-lg" />}
          <img
            src={image}
            alt={title}
            className={`w-full object-contain max-h-[512px] ${
              imageLoading ? "opacity-0" : "opacity-100"
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageLoading(false);
            }}
          />
        </div>
      )}

      <div className="prose max-w-none mb-4">{content}</div>

      <hr className="my-4" />

      <div
        className="flex items-center justify-between"
        onClick={handleActionClick}
      >
        <div className="votes flex items-center space-x-2">
          <button
            onClick={() => handleVoteClick("up")}
            className={`transition-colors ${
              userVote === "up"
                ? "text-orange-500"
                : "text-gray-400 hover:text-orange-500"
            }`}
          >
            <BiUpvote size={24} />
          </button>
          <span className="font-medium">{votes.upVotes - votes.downVotes}</span>
          <button
            onClick={() => handleVoteClick("down")}
            className={`transition-colors ${
              userVote === "down"
                ? "text-blue-500"
                : "text-gray-400 hover:text-blue-500"
            }`}
          >
            <BiDownvote size={24} />
          </button>
        </div>
        <div className="comments">
          <button
            onClick={handleCommentClick}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            {comments.length} comment{comments.length !== 1 ? "s" : ""}
          </button>
        </div>
        <button
          onClick={handleShareClick}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          share
        </button>
      </div>
    </div>
  );
};

export default PostCard;
