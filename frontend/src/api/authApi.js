import { axiosInstance } from "./axiosConfig";
import { setToken, setUser } from "../utils/authUtils";

// Mock data for demo purposes
const mockUsers = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    role: "USER",
  },
];

// Flag to determine if we use mock data or real API
const USE_MOCK_DATA = false;

const authApi = {
  login: async (email, password) => {
    if (USE_MOCK_DATA) {
      // For demo: simulate a network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Simulate login success with a mock token and user data
      // In a real app, this would come from the backend
      return {
        token: "mock-jwt-token",
        user: {
          id: "1",
          email: email,
          firstName: "John",
          lastName: "Doe",
          role: "USER",
        },
      };
    } else {
      try {
        const response = await axiosInstance.post("/auth/login", {
          email,
          password,
        });
        const { token, user } = response.data;

        // Store auth data
        setToken(token);
        setUser(user);

        return response.data;
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    }
  },

  register: async (userData) => {
    if (USE_MOCK_DATA) {
      // For demo: simulate a network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate registration success
      // In a real app, the backend would validate and store the user
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        ...userData,
        role: "USER",
      };

      mockUsers.push(newUser);

      return {
        success: true,
        message: "Registration successful",
        user: newUser,
      };
    } else {
      try {
        const response = await axiosInstance.post("/auth/register", userData);
        return response.data;
      } catch (error) {
        console.error("Registration error:", error);
        throw error;
      }
    }
  },

  getUserProfile: async () => {
    if (USE_MOCK_DATA) {
      // For demo: simulate a network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      return {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        role: "USER",
      };
    } else {
      try {
        const response = await axiosInstance.get("/auth/me");
        return response.data;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
      }
    }
  },

  updateUserProfile: async (userData) => {
    if (USE_MOCK_DATA) {
      // For demo: simulate a network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        success: true,
        message: "Profile updated successfully",
        user: {
          id: "1",
          ...userData,
          role: "USER",
        },
      };
    } else {
      try {
        const response = await axiosInstance.put("/users/me", userData);
        return response.data;
      } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
      }
    }
  },

  changePassword: async (passwordData) => {
    if (USE_MOCK_DATA) {
      // For demo: simulate a network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      return {
        success: true,
        message: "Password changed successfully",
      };
    } else {
      try {
        const response = await axiosInstance.post(
          "/users/me/password",
          passwordData
        );
        return response.data;
      } catch (error) {
        console.error("Error changing password:", error);
        throw error;
      }
    }
  },
};

export default authApi;
