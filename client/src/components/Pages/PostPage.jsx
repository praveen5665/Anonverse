import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPost } from "@/services/postService";
import { getCommentsByPostId } from "@/services/commentService";
import PostCard from "@/components/Pages/PostCard";
import CommentCard from "@/components/Pages/CommentCard";
import CommentForm from "@/components/Pages/CommentForm";

const PostPage = () => {
  const { postId } = useParams();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const fetchPostData = async () => {
    try {
      setLoading(true);
      const [postResponse, commentsResponse] = await Promise.all([
        getPost(postId),
        getCommentsByPostId(postId),
      ]);
      setPost(postResponse.data.data);
      setComments(
        Array.isArray(commentsResponse.data) ? commentsResponse.data : []
      );
    } catch (error) {
      setError(
        error.response?.data?.message || error.message || "Failed to load post"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchPostData();
    }
  }, [postId]);

  const handleCommentAdded = (newComment) => {
    fetchPostData();
    setShowCommentForm(false);
  };

  const handleCommentClick = () => {
    setShowCommentForm(true);
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      {loading && <p className="text-center py-10">Loading post...</p>}
      {error && (
        <p className="text-red-500 text-center py-10">
          Error: {typeof error === "string" ? error : JSON.stringify(error)}
        </p>
      )}
      {post && (
        <>
          <PostCard
            PostData={post}
            isPostPage={true}
            onCommentClick={handleCommentClick}
          />
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">
              Comments
            </h3>

            {/* Show comment form if button clicked or if there are no comments */}
            {(showCommentForm || !comments.length) && (
              <CommentForm
                postId={post._id}
                onCommentAdded={handleCommentAdded}
              />
            )}

            <div className="mt-6">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <CommentCard
                    key={comment._id}
                    comment={comment}
                    postId={post._id}
                    onCommentAdded={handleCommentAdded}
                  />
                ))
              ) : (
                <p className="text-gray-500">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PostPage;
