import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Snackbar,
  DialogContentText,
} from "@mui/material";
import {
  Add,
  Search,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import RegistrationCard from "../components/common/RegistrationCard";
import RegistrationForm from "../components/forms/RegistrationForm";
import * as registrationApi from "../api/registrationApi";
import * as eventApi from "../api/eventApi";
import { styled } from "@mui/material/styles";
import * as attendeeApi from "../api/attendeeApi";

// Check if we should use mock data - mirrors the API function
const shouldUseMockData = () => {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.REACT_APP_USE_MOCK_DATA === "true"
  );
};

const SearchContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  flexWrap: "wrap",
}));

const FiltersContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  flexWrap: "wrap",
}));

const RegistrationsPage = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [filteredRegistrations, setFilteredRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  const [currentRegistration, setCurrentRegistration] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [filterEvent, setFilterEvent] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("ALL");
  const [checkInStatusFilter, setCheckInStatusFilter] = useState("ALL");
  const [activeFilters, setActiveFilters] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: "",
    message: "",
    registration: null,
  });
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteResult, setDeleteResult] = useState({
    success: false,
    message: "",
  });
  const [checkinInProgress, setCheckinInProgress] = useState(false);

  useEffect(() => {
    loadEvents();
    loadAttendees();
    loadRegistrations();
  }, []);

  // Apply filtering when search term or filters change
  useEffect(() => {
    if (registrations.length > 0) {
      filterRegistrationsLocally();
    }
  }, [
    searchTerm,
    paymentStatusFilter,
    checkInStatusFilter,
    selectedEvent,
    registrations,
  ]);

  const loadEvents = async () => {
    try {
      const data = await eventApi.fetchEvents();
      setEvents(data.content || []);
    } catch (err) {
      console.error("Error loading events:", err);
      showMessage("Failed to load events", "error");

      // Fallback to empty array
      setEvents([]);
    }
  };

  const loadAttendees = async () => {
    try {
      const data = await attendeeApi.fetchAttendees();
      setAttendees(data.content || []);
    } catch (err) {
      console.error("Error loading attendees:", err);
      showMessage("Failed to load attendees", "error");

      // Fallback to empty array
      setAttendees([]);
    }
  };

  const loadRegistrations = async (page = 0) => {
    setLoading(true);
    setError(null);

    try {
      let response;

      if (selectedEvent && paymentStatusFilter !== "ALL") {
        response =
          await registrationApi.fetchRegistrationsByEventIdAndPaymentStatus(
            selectedEvent,
            paymentStatusFilter,
            page
          );
      } else if (selectedEvent) {
        response = await registrationApi.fetchRegistrationsByEventId(
          selectedEvent,
          page
        );
      } else {
        response = await registrationApi.fetchRegistrations(page);
      }

      setRegistrations(
        Array.isArray(response) ? response : response.content || []
      );
      setFilteredRegistrations(
        Array.isArray(response) ? response : response.content || []
      );
      setTotalPages(response.totalPages || 1);
      setCurrentPage(page);
      setLoading(false);
    } catch (err) {
      console.error("Error loading registrations:", err);
      setError("Failed to load registrations. Please try again.");
      setLoading(false);
      showMessage("Failed to load registrations", "error");
    }
  };

  const filterRegistrationsLocally = () => {
    if (!registrations.length) return;

    let filtered = [...registrations];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((reg) => {
        const attendeeName = reg.attendee
          ? `${reg.attendee.firstName} ${reg.attendee.lastName}`.toLowerCase()
          : "";
        const eventName = reg.event ? reg.event.name.toLowerCase() : "";
        const confirmationNumber = reg.confirmationNumber.toLowerCase();

        return (
          attendeeName.includes(term) ||
          eventName.includes(term) ||
          confirmationNumber.includes(term)
        );
      });
    }

    // Apply payment status filter if it's not ALL
    if (paymentStatusFilter !== "ALL") {
      filtered = filtered.filter(
        (reg) => reg.paymentStatus === paymentStatusFilter
      );
    }

    // Apply check-in status filter if it's not ALL
    if (checkInStatusFilter !== "ALL") {
      filtered = filtered.filter((reg) =>
        checkInStatusFilter === "CHECKED_IN"
          ? reg.checkInStatus === "CHECKED_IN"
          : reg.checkInStatus === "NOT_CHECKED_IN"
      );
    }

    // Apply event filter if selected
    if (selectedEvent) {
      filtered = filtered.filter((reg) => reg.eventId === selectedEvent);
    }

    setFilteredRegistrations(filtered);
  };

  const handleSearch = () => {
    filterRegistrationsLocally();
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSelectedEvent("");
    setPaymentStatusFilter("ALL");
    setCheckInStatusFilter("ALL");
    setActiveFilters([]);
    loadRegistrations(0);
  };

  const handlePageChange = (event, page) => {
    loadRegistrations(page - 1);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    if (newValue === 0) {
      setPaymentStatusFilter("ALL");
    } else if (newValue === 1) {
      setPaymentStatusFilter("COMPLETED");
    } else if (newValue === 2) {
      setPaymentStatusFilter("PENDING");
    }

    updateActiveFilters();
  };

  const handleAddRegistration = () => {
    setCurrentRegistration(null);
    setShowAddDialog(true);
  };

  const handleEditRegistration = (registration) => {
    setCurrentRegistration(registration);
    setShowEditDialog(true);
  };

  const handleDeleteRegistrationDialog = (registration) => {
    setCurrentRegistration(registration);
    setShowDeleteDialog(true);
  };

  const handleCheckInRegistration = (registration) => {
    setCurrentRegistration(registration);
    setShowCheckInDialog(true);
  };

  const handleViewRegistration = (registrationId) => {
    navigate(`/registrations/${registrationId}`);
  };

  const handleFormSubmit = async (formData) => {
    setFormSubmitting(true);
    console.log("Submitting registration form with data:", formData);

    try {
      if (currentRegistration) {
        // Update existing registration
        console.log(`Updating registration with ID: ${currentRegistration.id}`);
        const updatedRegistration = await registrationApi.updateRegistration(
          currentRegistration.id,
          formData
        );
        console.log("Registration updated successfully:", updatedRegistration);

        // Update both data arrays
        const updateRegistrationInArray = (array) => {
          return array.map((reg) =>
            reg.id === updatedRegistration.id ? updatedRegistration : reg
          );
        };

        setRegistrations(updateRegistrationInArray(registrations));
        setFilteredRegistrations(
          updateRegistrationInArray(filteredRegistrations)
        );

        showMessage("Registration updated successfully", "success");
      } else {
        // Create new registration
        console.log("Creating new registration");
        const newRegistration = await registrationApi.createRegistration(
          formData
        );
        console.log("Registration created successfully:", newRegistration);

        // Add to both data arrays
        setRegistrations([newRegistration, ...registrations]);

        // If the registration passes current filters, add it to filtered registrations too
        const passesFilters = shouldAddToFilteredList(newRegistration);
        if (passesFilters) {
          setFilteredRegistrations([newRegistration, ...filteredRegistrations]);
        }

        showMessage("Registration created successfully", "success");
      }

      // Close dialogs and reset state
      setShowAddDialog(false);
      setShowEditDialog(false);
      setCurrentRegistration(null);
    } catch (err) {
      console.error("Error saving registration:", err);

      // If in mock mode, we'll proceed as if it worked
      if (shouldUseMockData()) {
        console.warn("In mock mode - proceeding as if save succeeded");

        // Generate mock data for visual feedback
        const mockData = {
          ...formData,
          id: currentRegistration
            ? currentRegistration.id
            : `reg-mock-${Date.now()}`,
          confirmationNumber: currentRegistration
            ? currentRegistration.confirmationNumber
            : `REG-MOCK-${Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase()}`,
          registrationDate: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        if (currentRegistration) {
          // Update existing registration in state with mock data
          const updateRegistrationInArray = (array) => {
            return array.map((reg) =>
              reg.id === mockData.id ? mockData : reg
            );
          };

          setRegistrations(updateRegistrationInArray(registrations));
          setFilteredRegistrations(
            updateRegistrationInArray(filteredRegistrations)
          );

          showMessage(
            "Registration updated successfully (mock mode)",
            "success"
          );
        } else {
          // Add new mock registration to state
          setRegistrations([mockData, ...registrations]);
          setFilteredRegistrations([mockData, ...filteredRegistrations]);

          showMessage(
            "Registration created successfully (mock mode)",
            "success"
          );
        }

        // Close dialogs and reset state
        setShowAddDialog(false);
        setShowEditDialog(false);
        setCurrentRegistration(null);
      } else {
        showMessage(
          `Failed to save registration: ${err.message || "Unknown error"}`,
          "error"
        );
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  // Helper function to check if a registration should be added to the filtered list
  const shouldAddToFilteredList = (registration) => {
    // Apply event filter
    if (selectedEvent && registration.eventId !== selectedEvent) {
      return false;
    }

    // Apply payment status filter
    if (
      paymentStatusFilter !== "ALL" &&
      registration.paymentStatus !== paymentStatusFilter
    ) {
      return false;
    }

    // Apply check-in status filter
    if (
      checkInStatusFilter !== "ALL" &&
      registration.checkInStatus !== checkInStatusFilter
    ) {
      return false;
    }

    // Apply search term if present
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      const attendeeName = `${registration.attendee?.firstName || ""} ${
        registration.attendee?.lastName || ""
      }`.toLowerCase();
      const confirmationNumber = (
        registration.confirmationNumber || ""
      ).toLowerCase();
      const eventName = (registration.event?.name || "").toLowerCase();

      if (
        !attendeeName.includes(lowerSearchTerm) &&
        !confirmationNumber.includes(lowerSearchTerm) &&
        !eventName.includes(lowerSearchTerm)
      ) {
        return false;
      }
    }

    return true;
  };

  const executeDeleteRegistration = async () => {
    if (!currentRegistration) {
      console.error("No registration provided for deletion");
      showMessage("Cannot delete: registration data missing", "error");
      return;
    }

    console.log(`Attempting to delete registration: ${currentRegistration.id}`);
    setDeleting(true);

    try {
      await registrationApi.deleteRegistration(currentRegistration.id);
      console.log(
        `Registration successfully deleted: ${currentRegistration.id}`
      );

      // Update local state
      setRegistrations(
        registrations.filter((r) => r.id !== currentRegistration.id)
      );
      setFilteredRegistrations(
        filteredRegistrations.filter((r) => r.id !== currentRegistration.id)
      );

      showMessage("Registration deleted successfully", "success");
      setShowDeleteDialog(false);
      setCurrentRegistration(null);
    } catch (error) {
      console.error("Error deleting registration:", error);

      // In development mode with mock data, we'll proceed as if deleted
      if (shouldUseMockData()) {
        console.warn("In mock mode - proceeding as if deletion succeeded");

        // Update local state
        setRegistrations(
          registrations.filter((r) => r.id !== currentRegistration.id)
        );
        setFilteredRegistrations(
          filteredRegistrations.filter((r) => r.id !== currentRegistration.id)
        );

        showMessage("Registration deleted successfully (mock mode)", "success");
        setShowDeleteDialog(false);
        setCurrentRegistration(null);
      } else {
        showMessage(
          `Failed to delete registration: ${error.message || "Unknown error"}`,
          "error"
        );
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleConfirmCheckIn = async (registrationParam) => {
    // Use the provided registration parameter or fall back to currentRegistration state
    const registration = registrationParam || currentRegistration;

    if (!registration) {
      console.error("No registration provided for check-in");
      showMessage("Cannot check in: registration data missing", "error");
      return;
    }

    setCheckinInProgress(true);

    try {
      console.log(
        `Processing check-in for registration ID: ${registration.id}`
      );
      const updatedRegistration = await registrationApi.checkInRegistration(
        registration.id
      );

      // Update registration in state
      setRegistrations(
        registrations.map((reg) =>
          reg.id === updatedRegistration.id ? updatedRegistration : reg
        )
      );

      // Also update filtered registrations to reflect changes immediately
      setFilteredRegistrations(
        filteredRegistrations.map((reg) =>
          reg.id === updatedRegistration.id ? updatedRegistration : reg
        )
      );

      setShowCheckInDialog(false);
      setCurrentRegistration(null);
      showMessage("Registration checked in successfully", "success");
    } catch (err) {
      console.error("Error checking in registration:", err);
      showMessage(
        `Failed to check in registration: ${err.message || "Unknown error"}`,
        "error"
      );
    } finally {
      setCheckinInProgress(false);
    }
  };

  const getEventName = (eventId) => {
    const event = events.find((event) => event.id === eventId);
    return event ? event.name : "Unknown Event";
  };

  const updateActiveFilters = () => {
    const newFilters = [];

    if (selectedEvent) {
      newFilters.push({
        key: "event",
        label: `Event: ${getEventName(selectedEvent)}`,
        value: selectedEvent,
      });
    }

    if (paymentStatusFilter !== "ALL") {
      newFilters.push({
        key: "paymentStatus",
        label: `Payment: ${paymentStatusFilter}`,
        value: paymentStatusFilter,
      });
    }

    if (checkInStatusFilter !== "ALL") {
      newFilters.push({
        key: "checkInStatus",
        label: `Check-in: ${
          checkInStatusFilter === "CHECKED_IN" ? "Checked In" : "Not Checked In"
        }`,
        value: checkInStatusFilter,
      });
    }

    setActiveFilters(newFilters);
  };

  const handleFilterRemove = (filterKey) => {
    if (filterKey === "event") {
      setSelectedEvent("");
    } else if (filterKey === "paymentStatus") {
      setPaymentStatusFilter("ALL");
      setTabValue(0);
    } else if (filterKey === "checkInStatus") {
      setCheckInStatusFilter("ALL");
    }

    updateActiveFilters();
  };

  const handleDeleteConfirm = (registration) => {
    setConfirmDialog({
      open: true,
      title: "Confirm Deletion",
      message: `Are you sure you want to delete the registration for ${
        registration.attendee
          ? `${registration.attendee.firstName} ${registration.attendee.lastName}`
          : "Unknown Attendee"
      }? This action cannot be undone.`,
      registration: registration,
    });
  };

  const handleRegistrationCardAction = (action, registration) => {
    console.log(`Registration card action: ${action}`, registration);
    setCurrentRegistration(registration);

    switch (action) {
      case "view":
        try {
          navigate(`/registrations/${registration.id}`);
          console.log(`Navigating to registration details: ${registration.id}`);
        } catch (error) {
          console.error("Error navigating to registration details:", error);
          showMessage("Error viewing registration details", "error");
        }
        break;
      case "edit":
        try {
          setShowEditDialog(true);
          console.log(
            `Opening edit dialog for registration: ${registration.id}`
          );
        } catch (error) {
          console.error("Error opening edit dialog:", error);
          showMessage("Error opening edit form", "error");
        }
        break;
      case "delete":
        try {
          setShowDeleteDialog(true);
          console.log(
            `Opening delete dialog for registration: ${registration.id}`
          );
        } catch (error) {
          console.error("Error opening delete dialog:", error);
          showMessage("Error preparing to delete registration", "error");
        }
        break;
      case "check-in":
        try {
          console.log(`Checking in registration: ${registration.id}`);
          handleConfirmCheckIn(registration);
        } catch (error) {
          console.error("Error during check-in process:", error);
          showMessage("Error checking in registration", "error");
        }
        break;
      default:
        console.warn(`Unknown registration action: ${action}`);
        break;
    }
  };

  const showMessage = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Registrations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage event registrations, check in attendees, and track payments
        </Typography>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }} elevation={0} variant="outlined">
        <SearchContainer>
          <TextField
            placeholder="Search by name, confirmation number, or event"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchTerm("")}
                    aria-label="clear search"
                  >
                    <Box
                      component="span"
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        bgcolor: "action.disabled",
                        color: "common.white",
                        fontSize: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      ×
                    </Box>
                  </IconButton>
                </InputAdornment>
              ),
            }}
            size="small"
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddRegistration}
            startIcon={<Add />}
          >
            Add Registration
          </Button>

          <Button
            variant="outlined"
            onClick={() => setShowFilters(!showFilters)}
            startIcon={<FilterListIcon />}
            sx={{ ml: "auto" }}
          >
            Filters
          </Button>

          <Button
            variant="outlined"
            onClick={() => loadRegistrations()}
            startIcon={<RefreshIcon />}
          >
            Refresh
          </Button>
        </SearchContainer>

        {showFilters && (
          <FiltersContainer>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Event</InputLabel>
              <Select
                value={selectedEvent}
                onChange={(e) => {
                  setSelectedEvent(e.target.value);
                  updateActiveFilters();
                }}
                label="Event"
              >
                <MenuItem value="">All Events</MenuItem>
                {events.map((event) => (
                  <MenuItem key={event.id} value={event.id}>
                    {event.name || event.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Payment Status</InputLabel>
              <Select
                value={paymentStatusFilter}
                onChange={(e) => {
                  setPaymentStatusFilter(e.target.value);
                  updateActiveFilters();
                }}
                label="Payment Status"
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="FAILED">Failed</MenuItem>
                <MenuItem value="REFUNDED">Refunded</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Check-In Status</InputLabel>
              <Select
                value={checkInStatusFilter}
                onChange={(e) => {
                  setCheckInStatusFilter(e.target.value);
                  updateActiveFilters();
                }}
                label="Check-In Status"
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value="CHECKED_IN">Checked In</MenuItem>
                <MenuItem value="NOT_CHECKED_IN">Not Checked In</MenuItem>
              </Select>
            </FormControl>

            {activeFilters.length > 0 && (
              <Button
                size="small"
                onClick={handleClearSearch}
                sx={{ ml: "auto" }}
              >
                Clear All Filters
              </Button>
            )}
          </FiltersContainer>
        )}

        {activeFilters.length > 0 && (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {activeFilters.map((filter) => (
              <Chip
                key={filter.key}
                label={filter.label}
                onDelete={() => handleFilterRemove(filter.key)}
                size="small"
              />
            ))}
          </Box>
        )}
      </Paper>

      <Box sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="All Registrations" />
          <Tab label="Paid" />
          <Tab label="Pending Payment" />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ position: "relative", minHeight: 200 }}>
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {filteredRegistrations.length > 0 ? (
          <Grid container spacing={3}>
            {filteredRegistrations.map((registration) => (
              <Grid item xs={12} md={6} lg={4} key={registration.id}>
                <RegistrationCard
                  registration={registration}
                  onView={() =>
                    handleRegistrationCardAction("view", registration)
                  }
                  onEdit={() =>
                    handleRegistrationCardAction("edit", registration)
                  }
                  onDelete={() =>
                    handleRegistrationCardAction("delete", registration)
                  }
                  onCheckIn={() =>
                    handleRegistrationCardAction("check-in", registration)
                  }
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          !loading && (
            <Paper sx={{ p: 4, textAlign: "center" }} variant="outlined">
              <Typography variant="h6" sx={{ mb: 2 }}>
                No registrations found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {registrations.length > 0
                  ? "Try adjusting your search criteria or filters"
                  : "Add your first registration to get started"}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleAddRegistration}
              >
                Add Registration
              </Button>
            </Paper>
          )
        )}
      </Box>

      {totalPages > 1 && (
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={currentPage + 1}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Add Registration Dialog */}
      <Dialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Registration</DialogTitle>
        <DialogContent dividers>
          <RegistrationForm
            events={events}
            attendees={attendees}
            onSave={handleFormSubmit}
            mode="create"
            isSubmitting={formSubmitting}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowAddDialog(false)}
            disabled={formSubmitting}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Registration Dialog */}
      <Dialog
        open={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Registration</DialogTitle>
        <DialogContent dividers>
          {currentRegistration && (
            <RegistrationForm
              initialData={currentRegistration}
              events={events}
              attendees={attendees}
              onSave={handleFormSubmit}
              mode="edit"
              isSubmitting={formSubmitting}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowEditDialog(false)}
            disabled={formSubmitting}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this registration? This action
            cannot be undone.
          </DialogContentText>
          {currentRegistration && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">
                {currentRegistration.attendee
                  ? `${currentRegistration.attendee.firstName} ${currentRegistration.attendee.lastName}`
                  : "Unknown Attendee"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Event:{" "}
                {currentRegistration.event
                  ? currentRegistration.event.name ||
                    currentRegistration.event.title
                  : "Unknown Event"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Confirmation: {currentRegistration.confirmationNumber}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowDeleteDialog(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={executeDeleteRegistration}
            color="error"
            disabled={deleting}
            startIcon={deleting && <CircularProgress size={20} />}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Check-In Confirmation Dialog */}
      <Dialog
        open={showCheckInDialog}
        onClose={() => setShowCheckInDialog(false)}
      >
        <DialogTitle>Confirm Check-In</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to check in this registration?
          </DialogContentText>
          {currentRegistration && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">
                {currentRegistration.attendee
                  ? `${currentRegistration.attendee.firstName} ${currentRegistration.attendee.lastName}`
                  : "Unknown Attendee"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Event:{" "}
                {currentRegistration.event
                  ? currentRegistration.event.name ||
                    currentRegistration.event.title
                  : "Unknown Event"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Confirmation: {currentRegistration.confirmationNumber}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCheckInDialog(false)}>Cancel</Button>
          <Button
            onClick={() => handleConfirmCheckIn(currentRegistration)}
            color="primary"
            variant="contained"
            disabled={checkinInProgress}
          >
            {checkinInProgress ? "Checking In..." : "Check In"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RegistrationsPage;
