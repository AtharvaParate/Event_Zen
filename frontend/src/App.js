import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";

// Error handling utilities
import { applyMaterialUIPatches } from "./utils/errorHandling";

// Layouts
import MainLayout from "./components/layouts/MainLayout";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage.jsx";
import NotFoundPage from "./pages/NotFoundPage";
import CreateEventPage from "./pages/CreateEventPage";
import EventDetailPage from "./pages/EventDetailPage";
import EditEventPage from "./pages/EditEventPage";
import VendorsPage from "./pages/VendorsPage";
import VendorDetailsPage from "./pages/VendorDetailsPage";
import ProfilePage from "./pages/ProfilePage";
import EventsPage from "./pages/EventsPage";
import AttendeesPage from "./pages/AttendeesPage";
import RegistrationsPage from "./pages/RegistrationsPage";
import AttendeeDetailPage from "./pages/AttendeeDetailPage";
import RegistrationDetailPage from "./pages/RegistrationDetailPage";
import EditRegistrationPage from "./pages/EditRegistrationPage";
import VenuesPage from "./pages/VenuesPage";
import VenueDetailPage from "./pages/VenueDetailPage";
import BudgetsPage from "./pages/BudgetsPage";
import BudgetDetailPage from "./pages/BudgetDetailPage";
import DevToolsPage from "./pages/DevToolsPage";

// Auth
import { checkAuth } from "./store/authSlice";

// Missing pages - will be created as placeholders
// import EventsPage from "./pages/EventsPage";

// Define the theme
const theme = createTheme({
  // You can customize the theme here if needed
  // Example: palette: { primary: { main: '#1976d2' } }
});

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
    <ThemeProvider theme={theme}>
      <CssBaseline />
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

          {/* Venue Management Routes */}
          <Route path="venues" element={<VenuesPage />} />
          <Route path="venues/:id" element={<VenueDetailPage />} />
          <Route
            path="venues/edit/:id"
            element={<VenueDetailPage edit={true} />}
          />

          {/* Budget Management Routes */}
          <Route path="budgets" element={<BudgetsPage />} />
          <Route path="budgets/:id" element={<BudgetDetailPage />} />
          <Route
            path="budgets/edit/:id"
            element={<BudgetDetailPage edit={true} />}
          />

          {/* Attendee Management Routes */}
          <Route path="attendees" element={<AttendeesPage />} />
          <Route
            path="attendees/edit/:id"
            element={<AttendeeDetailPage edit={true} />}
          />
          <Route path="attendees/:id" element={<AttendeeDetailPage />} />

          {/* Registration Management Routes */}
          <Route path="registrations" element={<RegistrationsPage />} />
          <Route
            path="registrations/:id"
            element={<RegistrationDetailPage />}
          />
          <Route
            path="registrations/edit/:id"
            element={<EditRegistrationPage />}
          />

          {/* Developer Tools */}
          <Route path="dev" element={<DevToolsPage />} />

          {/* 404 Page */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
