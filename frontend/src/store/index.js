import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import eventReducer from "./eventSlice";
import vendorReducer from "./vendorSlice";
import uiReducer from "./uiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    vendors: vendorReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
