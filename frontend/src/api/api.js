import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export const searchUsers = async (query) => {
  if (!query) return [];
  const res = await api.get(`/api/users/search?q=${query}`);
  return res.data;
};

export const getUserById = async (id) => {
  try {
    const res = await api.get(`/api/users/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error.response?.data || error);
    throw error;
  }
};

export default api;
