import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useSelector, useDispatch } from "react-redux";

// Layouts
import MainLayout from "./components/layouts/MainLayout";

// Pages
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import CreateEvent from "./pages/CreateEvent";
import Vendors from "./pages/Vendors";
import VendorDetails from "./pages/VendorDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Auth
import PrivateRoute from "./components/auth/PrivateRoute";
import { checkAuth } from "./store/authSlice";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Blue
    },
    secondary: {
      main: "#f50057", // Pink
    },
    background: {
      default: "#f7f9fc",
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Segoe UI', 'Arial', sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 500,
    },
  },
});

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="vendors/:id" element={<VendorDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="events/create" element={<CreateEvent />} />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
