import axios from "axios";

const COMMENT_API_URL = "http://localhost:5000/api/comment";

export const createComment = async ({
  postId,
  content,
  parentCommentId = null,
}) => {
  if (!postId || !content) {
    throw new Error("PostId and content are required");
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found. Please login.");
    }

    const response = await axios.post(
      COMMENT_API_URL,
      {
        postId: postId,
        content: content,
        parentCommentId: parentCommentId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          token: token,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Failed to create comment"
      );
    }
  }
};

export const getCommentsByPostId = async (postId) => {
  try {
    const response = await axios.get(`${COMMENT_API_URL}/${postId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to get comments");
  }
};



export const voteOnComment = async (commentId, voteType, currentVote) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found. Please login.");
    }

    const newVoteType = currentVote === voteType ? null : voteType;

    const response = await axios.post(
      `${COMMENT_API_URL}/${commentId}/vote`,
      { voteType: newVoteType },
      {
        headers: {
        "Content-Type": "application/json",
          token: token,
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to vote on comment");
    }
    return response.data.data;
  } catch (error) {
    console.error(
      "Error voting on comment:",
      error.response?.data || error.message
    );
    throw error;
  }
};
