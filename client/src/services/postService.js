import axios from "axios";
const API_URL = "http://localhost:5000/api/post/";

export const createPost = async (postData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(API_URL, postData, {
      headers: {
        "token": token,
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create post");
    }

    return response;
  } catch (error) {
    console.error("Error creating post:", error.response?.data || error.message);
    throw error;
  }
}