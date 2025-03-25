import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { StyledEngineProvider } from "@mui/material/styles";
import App from "./App";
import store from "./store";
import "./index.css";

// Apply error handling patches
import { applyMaterialUIPatches } from "./utils/errorHandling";
import { applyMUITransitionFixes } from "./utils/muiFixes";

// Apply patches immediately to prevent errors during initial render
applyMaterialUIPatches();
// Apply MUI transition fixes immediately
applyMUITransitionFixes();

const root = ReactDOM.createRoot(document.getElementById("root"));

// In development, disable StrictMode to avoid animation issues
if (process.env.NODE_ENV === "development") {
  root.render(
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StyledEngineProvider>
    </Provider>
  );
} else {
  // In production, use StrictMode
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <StyledEngineProvider injectFirst>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </StyledEngineProvider>
      </Provider>
    </React.StrictMode>
  );
}
