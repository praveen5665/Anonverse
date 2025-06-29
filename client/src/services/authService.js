import axios from "axios";

const API_URL = "https://anonverse.onrender.com/api/auth";

export const signupUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

export const loginUser = async (loginData) => {
    const response = await axios.post(`${API_URL}/login`, loginData);
    return response.data;
}

export const logoutUser = async () => {
    const response = await axios.post(`${API_URL}/logout`);
    return response.data;
};


// export const getUserDetails = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//         return null;
//     }
//     try {
//         const response = await axios.get(`${API_URL}/me`, {
//             headers: {
//                 "token": token,
//             },
//         });
//         return response.data.user;
//     } catch (error) {
//         console.error("Error fetching user details:", error);
//         return null;
//     }
// };
