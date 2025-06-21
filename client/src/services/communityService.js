import axios from "axios";

const API_URL = "http://localhost:5000/api/r";

export const createCommunity = async (data) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(`${API_URL}`, data, {
    headers: {
      token: token,
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};
export const getCommunityByName = async (name) => {
  return await axios.get(`${API_URL}/${name}`);
};

export const joinCommunity = async (communityId) => {
  const token = localStorage.getItem("token");
  return await axios.post(
    `${API_URL}/join`,
    { communityId },
    {
      headers: {
        token: token,
      },
    }
  );
};

export const leaveCommunity = async (communityId) => {
  const token = localStorage.getItem("token");
  return await axios.post(
    `${API_URL}/leave`,
    { communityId },
    {
      headers: {
        token: token,
      },
    }
  );
};

export const isMember = async (communityId) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}/member/${communityId}`, {
      headers: {
        token: token,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error checking membership:", error);
    throw error;
  }
};
