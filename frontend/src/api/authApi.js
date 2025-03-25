import axios from "./axiosConfig";

const authApi = {
  login: async (email, password) => {
    return await axios.post("/auth/login", { email, password });
  },

  register: async (userData) => {
    return await axios.post("/auth/register", userData);
  },

  getUserProfile: async () => {
    return await axios.get("/users/profile");
  },

  updateUserProfile: async (userData) => {
    return await axios.put("/users/profile", userData);
  },

  changePassword: async (passwordData) => {
    return await axios.post("/users/change-password", passwordData);
  },
};

export default authApi;
