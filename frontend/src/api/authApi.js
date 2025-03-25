import axios from "./axiosConfig";

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

const authApi = {
  login: async (email, password) => {
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
  },

  register: async (userData) => {
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
  },

  getUserProfile: async () => {
    // For demo: simulate a network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      role: "USER",
    };
  },

  updateUserProfile: async (userData) => {
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
  },

  changePassword: async (passwordData) => {
    // For demo: simulate a network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      message: "Password changed successfully",
    };
  },
};

export default authApi;
