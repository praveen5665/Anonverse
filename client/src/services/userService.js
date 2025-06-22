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
