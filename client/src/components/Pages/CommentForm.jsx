import React, { useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import { createComment } from "@/services/commentService";
import { toast } from "sonner";

const CommentForm = ({ postId, onCommentAdded, parentCommentId = null }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { user, token } = useUserContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !token) {
      toast.error("Login to comment");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const comment = await createComment({
        postId: postId,
        content: content.trim(),
        parentCommentId: parentCommentId,
      });

      setContent("");
      if (onCommentAdded && comment) {
        onCommentAdded(comment);
      }
      toast.success(
        parentCommentId
          ? "Reply posted successfully!"
          : "Comment posted successfully!"
      );
    } catch (err) {
      console.error("Failed to post comment:", err);
      toast.error(err.message);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${parentCommentId ? "mt-2" : "mt-6"} mb-6`}
    >
      <div className="mb-2">
        <label htmlFor="commentContent" className="sr-only">
          {parentCommentId ? "Add a reply" : "Add a comment"}
        </label>
        <textarea
          id="commentContent"
          rows={parentCommentId ? "2" : "3"}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder={parentCommentId ? "Write a reply..." : "Type here..."}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        />
      </div>
      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting
            ? "Posting..."
            : parentCommentId
            ? "Reply"
            : "Post Comment"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
