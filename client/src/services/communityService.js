import axios from "axios";

const API_URL = "http://localhost:5000/api/r";

export const createCommunity = async (data) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}`, data, {
        headers: {
            token: token,
            "Content-Type": "multipart/form-data"
          }
    });
    return response;
};
