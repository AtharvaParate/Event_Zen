import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  alert: null,
  drawer: false,
  darkMode: false,
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
      localStorage.setItem("darkMode", state.darkMode);
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem("darkMode", state.darkMode);
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
