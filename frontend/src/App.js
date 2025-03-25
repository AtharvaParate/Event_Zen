import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Error handling utilities
import { applyMaterialUIPatches } from "./utils/errorHandling";

// Layouts
import MainLayout from "./components/layouts/MainLayout";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import CreateEventPage from "./pages/CreateEventPage";
import EventDetailPage from "./pages/EventDetailPage";
import EditEventPage from "./pages/EditEventPage";
import VendorsPage from "./pages/VendorsPage";
import VendorDetailsPage from "./pages/VendorDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import EventsPage from "./pages/EventsPage";

// Auth
import { checkAuth } from "./store/authSlice";

// Missing pages - will be created as placeholders
// import EventsPage from "./pages/EventsPage";

function App() {
  const dispatch = useDispatch();
  // We keep isAuthenticated even though it's not directly used here,
  // as it might be needed for future protected route implementation
  // eslint-disable-next-line no-unused-vars
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check authentication status when app loads
    dispatch(checkAuth());

    // Apply patches to prevent Material-UI errors
    applyMaterialUIPatches();
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="events" element={<EventsPage />} />
        <Route path="events/:id" element={<EventDetailPage />} />
        <Route path="vendors" element={<VendorsPage />} />
        <Route path="vendors/:id" element={<VendorDetailsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="events/create" element={<CreateEventPage />} />
        <Route path="events/edit/:id" element={<EditEventPage />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
