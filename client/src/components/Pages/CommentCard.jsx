import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import { formatDistanceToNow } from "date-fns";
import { useUserContext } from "@/context/AuthContext";
import { toast } from "sonner";
import { voteOnComment } from "@/services/commentService";
import CommentForm from "./CommentForm";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const CommentCard = ({ comment, postId }) => {
  const { user, token } = useUserContext();

  const {
    _id,
    content,
    authorId,
    createdAt,
    upVotes = [],
    downVotes = [],
    replies,
  } = comment;

  const [showReplies, setShowReplies] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [currentVotes, setCurrentVotes] = useState({
    up: upVotes.length,
    down: downVotes.length,
  });
  const [isReplying, setIsReplying] = useState(false);

  useEffect(() => {
    if (user?.id) {
      const userIdStr = String(user.id);
      if (upVotes.map(String).includes(userIdStr)) {
        setUserVote("up");
      } else if (downVotes.map(String).includes(userIdStr)) {
        setUserVote("down");
      } else {
        setUserVote(null);
      }
    } else {
      setUserVote(null);
    }
    setCurrentVotes({ up: upVotes.length, down: downVotes.length });
  }, [upVotes, downVotes, user]);

  const handleVote = async (voteType) => {
    if (!user || !token) {
      toast("Login to Vote");
      return;
    }

    try {
      const result = await voteOnComment(_id, voteType, userVote);
      const { upVotes, downVotes } = result;

      let newUpVotes = currentVotes.up;
      let newDownVotes = currentVotes.down;

      if (userVote === voteType) {
        setUserVote(null);
        if (voteType === "up") newUpVotes--;
        else newDownVotes--;
      } else {
        if (userVote === "up" && voteType === "down") newUpVotes--;
        if (userVote === "down" && voteType === "up") newDownVotes--;

        setUserVote(voteType);
        if (voteType === "up") newUpVotes++;
        else newDownVotes++;
      }

      setCurrentVotes({ up: newUpVotes, down: newDownVotes });
      setCurrentVotes({ up: upVotes, down: downVotes });
      setUserVote(userVote === voteType ? null : voteType);
    } catch (error) {
      console.error("Error while voting on comment:", error);
    }
  };

  const handleReplySubmit = (newReply) => {
    comment.replies = [...(comment.replies || []), newReply];
    setIsReplying(false);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return formatDistanceToNow(date) + " ago";
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  const authorUsername = authorId?.username || "Unknown User";
  const authorLink = authorId?._id ? `/u/${authorUsername}` : "#";

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Avatar className="h-8 w-8">
            <AvatarImage src={authorId?.avatarUrl} alt={authorUsername} />
            <AvatarFallback>
              {authorUsername?.slice(0, 2).toUpperCase() || "UN"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-500">
            <Link
              to={authorLink}
              className="font-medium text-gray-900 hover:underline"
            >
              {authorUsername}
            </Link>
            <span className="mx-1">•</span>
            <span>{formatDate(createdAt)}</span>
          </p>
          <div className="mt-1 text-sm text-gray-700">
            <p>{content}</p>
          </div>
          <div className="mt-2 flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handleVote("up")}
                className={`flex items-center transition-colors p-1 rounded-full ${
                  userVote === "up"
                    ? "text-orange-500 bg-orange-100"
                    : "text-gray-400 hover:text-orange-500 hover:bg-orange-50"
                }`}
                aria-label="Upvote comment"
              >
                <BiUpvote size={18} />
              </button>
              <span className="font-medium text-gray-700">
                {currentVotes.up - currentVotes.down}
              </span>
              <button
                onClick={() => handleVote("down")}
                className={`flex items-center transition-colors p-1 rounded-full ${
                  userVote === "down"
                    ? "text-blue-500 bg-blue-100"
                    : "text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                }`}
                aria-label="Downvote comment"
              >
                <BiDownvote size={18} />
              </button>
            </div>
            {replies && replies.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="text-gray-500 hover:text-gray-700 font-medium"
              >
                {showReplies
                  ? "Hide Replies"
                  : `${replies.length} ${
                      replies.length === 1 ? "Reply" : "Replies"
                    }`}
              </button>
            )}
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              Reply
            </button>
          </div>
        </div>
      </div>

      {isReplying && (
        <div className="ml-6 mt-2">
          <CommentForm
            postId={postId}
            parentCommentId={_id}
            onCommentAdded={handleReplySubmit}
          />
        </div>
      )}

      {showReplies && replies && replies.length > 0 && (
        <div className="ml-6 mt-3 pl-3 border-l-2 border-gray-200">
          {replies.map((reply) => (
            <CommentCard key={reply._id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
