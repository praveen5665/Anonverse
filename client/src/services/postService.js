import axios from "axios";
const API_URL = "http://localhost:5000/api/post/";

export const createPost = async (postData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(API_URL, postData, {
      headers: {
        token: token,
      },
    });

    if (!response.data.success) {
      console.error("Failed to create post:", response.data.message);
      throw new Error(response.data.message || "Failed to create post");
    }
    return response;  
  } catch (error) {
    console.error(
      "Error creating post:",
      error.response?.data || error.message
    );
    throw {
      message: error.response?.data?.message || "Failed to create post. Please try again.",
      error
    };
  }
};
export const getPostsByCommunityId = async (communityId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(API_URL, {
      headers: {
        token: token,
      },
      params: {
        communityId,
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch posts");
    }
    return response;
  } catch (error) {
    console.error(
      "Error fetching posts:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const handleVote = async (postId, voteType, currentVote) => {
  try {
    const token = localStorage.getItem("token");
    const newVoteType = currentVote === voteType ? null : voteType;

    const response = await axios.post(
      `${API_URL}${postId}/vote`,
      { voteType: newVoteType },
      {
        headers: {
          "Content-Type": "application/json",
          token,
        },
      }
    );

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    return response.data.data;
  } catch (error) {
    console.error("Error voting:", error);
    throw error;
  }
};

export const getPost = async (postId) => {
  try {
    const response = await axios.get(`${API_URL}${postId}`);
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch post");
    }
    return response;
  } catch (error) {
    console.error(
      "Error fetching post:",
      error.response?.data || error.message
    );
  }
};

export const getFilteredPosts = async (
  timeFilter = "all",
  sortFilter = "hot",
  options = {}
) => {
  try {
    const response = await axios.get(`${API_URL}filter`, {
      params: {
        timeFilter,
        sortFilter,
        ...options,
      },
    });

    if (!response.data?.success) {
      throw new Error(
        response.data?.message || "Failed to fetch filtered posts"
      );
    }
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};
