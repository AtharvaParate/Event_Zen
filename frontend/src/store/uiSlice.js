import { createSlice } from "@reduxjs/toolkit";

// Helper function to get stored dark mode preference safely
const getInitialDarkMode = () => {
  try {
    const storedDarkMode = localStorage.getItem("darkMode");
    // Check specifically for 'true' string since localStorage stores strings
    return storedDarkMode === 'true';
  } catch (e) {
    // In case of any localStorage errors
    console.warn('Error accessing localStorage for darkMode:', e);
    return false;
  }
};

const initialState = {
  alert: null,
  drawer: false,
  darkMode: getInitialDarkMode(),
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setAlert: (state, action) => {
      state.alert = action.payload;
    },
    clearAlert: (state) => {
      state.alert = null;
    },
    toggleDrawer: (state) => {
      state.drawer = !state.drawer;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      try {
        localStorage.setItem("darkMode", state.darkMode.toString());
      } catch (e) {
        console.warn('Error saving darkMode to localStorage:', e);
      }
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      try {
        localStorage.setItem("darkMode", state.darkMode.toString());
      } catch (e) {
        console.warn('Error saving darkMode to localStorage:', e);
      }
    },
  },
});

export const {
  setAlert,
  clearAlert,
  toggleDrawer,
  toggleDarkMode,
  setDarkMode,
} = uiSlice.actions;

export default uiSlice.reducer;
