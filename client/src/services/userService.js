import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/auth';

export const getUserProfile = async (username) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${username}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (data) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.put(`${API_BASE_URL}/user/profile`, data, {
      headers: { token },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

export const getUserStats = async (username) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/${username}/stats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
};
