import axios from "axios";

const API_URL = "http://localhost:5000/api/search";

export const searchContent = async (query, community = null) => {
  try {
    const params = new URLSearchParams({ q: query });
    if (community) {
      params.append("community", community);
    }

    const response = await axios.get(`${API_URL}?${params}`);

    if (!response.data.success) {
      throw new Error(response.data.message || "Search failed");
    }

    return response.data.data;
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
};
