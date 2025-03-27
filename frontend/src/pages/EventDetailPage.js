import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Container,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Event as EventIcon,
  LocationOn as LocationOnIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";
import { fetchEvent, deleteEvent } from "../store/eventSlice";
import { registerForEvent, mockRegisterForEvent } from "../api/attendeeApi";

const EventDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { event, loading, error } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [registrationForm, setRegistrationForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: "",
    ticketType: "STANDARD",
    notes: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    console.log("Fetching event with ID:", id);
    dispatch(fetchEvent(id));
  }, [dispatch, id]);

  useEffect(() => {
    // Log the event data when it changes
    console.log("Event data:", event);
    if (error) {
      console.error("Event fetch error:", error);
    }
  }, [event, error]);

  const handleEditClick = () => {
    navigate(`/events/edit/${id}`);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteEvent(id)).unwrap();
      setDeleteDialogOpen(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to delete event:", error);
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleRegisterClick = () => {
    setRegisterDialogOpen(true);
  };

  const handleRegistrationFormChange = (e) => {
    const { name, value } = e.target;
    setRegistrationForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!registrationForm.firstName) {
      errors.firstName = "First name is required";
    }

    if (!registrationForm.lastName) {
      errors.lastName = "Last name is required";
    }

    if (!registrationForm.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(registrationForm.email)) {
      errors.email = "Email is invalid";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegisterConfirm = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Set the proper price from the event
      const ticketPrice = event.price || 0;

      // Use the mock version in development, real version in production
      const result =
        process.env.NODE_ENV === "development"
          ? await mockRegisterForEvent(
              { ...registrationForm, ticketPrice },
              event.id
            )
          : await registerForEvent(
              { ...registrationForm, ticketPrice },
              event.id
            );

      console.log("Registration result:", result);
      setRegisterDialogOpen(false);

      // Show success message
      setSnackbar({
        open: true,
        message: "Registration successful! Check your email for confirmation.",
        severity: "success",
      });

      // Reset form
      setRegistrationForm({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phoneNumber: "",
        ticketType: "STANDARD",
        notes: "",
      });
    } catch (error) {
      console.error("Registration failed:", error);
      setSnackbar({
        open: true,
        message: `Registration failed: ${
          error.message || "Please try again later"
        }`,
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterCancel = () => {
    setRegisterDialogOpen(false);
  };

  // Helper function to check if a location is valid or default
  const formatLocation = (location) => {
    if (!location) return "Location not specified";

    if (typeof location !== "string") {
      console.warn("Non-string location:", location);
      return "Location not specified";
    }

    // Check if it's an empty string or just whitespace
    if (location.trim() === "") {
      return "Location not specified";
    }

    // Check for common default location names
    const defaultLocations = [
      "Test Location",
      "test location",
      "test",
      "Test",
      "TBD",
      "tbd",
      "To be determined",
      "to be determined",
      "Location",
    ];

    if (
      defaultLocations.some(
        (defaultLoc) =>
          location.trim().toLowerCase() === defaultLoc.toLowerCase()
      )
    ) {
      return "Location to be announced";
    }

    return location;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) {
      console.warn("Empty dateString encountered");
      return "Date not specified";
    }

    console.log(
      "formatDateTime called with:",
      typeof dateString,
      JSON.stringify(dateString, null, 2)
    );

    // Create a fallback display for arrays
    const createFallbackDisplay = (arr) => {
      if (!Array.isArray(arr) || arr.length < 3) return "Date format invalid";

      // Try to create a human-readable fallback
      try {
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const year = arr[0];
        const month = arr[1] - 1; // 0-based month
        const day = arr[2];
        const hour = arr.length >= 4 ? arr[3] : 0;
        const minute = arr.length >= 5 ? arr[4] : 0;

        const monthName = months[month] || `Month ${month + 1}`;
        const timeStr = `${hour}:${String(minute).padStart(2, "0")}`;

        return `${monthName} ${day}, ${year} at ${timeStr}`;
      } catch (e) {
        // If anything goes wrong with the fallback, return a basic format
        return arr.join("-");
      }
    };

    try {
      // If the date is an array (as returned by Java backend), convert it to a proper date string
      if (Array.isArray(dateString)) {
        console.log("Processing array date:", dateString);
        // Format: [year, month, day, hour, minute, second, ...]
        if (dateString.length >= 3) {
          const year = dateString[0];
          const month = dateString[1] - 1; // Month is 0-indexed in JS
          const day = dateString[2];
          const hour = dateString.length >= 4 ? dateString[3] : 0;
          const minute = dateString.length >= 5 ? dateString[4] : 0;

          console.log(
            `Creating date with: year=${year}, month=${month}, day=${day}, hour=${hour}, minute=${minute}`
          );

          // Use alternative date creation methods for better compatibility
          // Method 1: ISO String approach
          const isoString = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}T${String(hour).padStart(
            2,
            "0"
          )}:${String(minute).padStart(2, "0")}:00`;
          console.log("Created ISO string:", isoString);

          let date = new Date(isoString);

          // Fallback to direct constructor if ISO approach fails
          if (isNaN(date.getTime())) {
            console.log("ISO approach failed, trying direct constructor");
            date = new Date(year, month, day, hour, minute);
          }

          console.log(
            "Created date object:",
            date.toString(),
            "Valid:",
            !isNaN(date.getTime())
          );

          if (isNaN(date.getTime())) {
            console.warn("Invalid date array:", dateString);
            // Return fallback format instead of error message
            return createFallbackDisplay(dateString);
          }

          const formattedDate = date.toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
          console.log("Formatted date:", formattedDate);
          return formattedDate;
        }
        console.warn("Array date doesn't have enough elements:", dateString);
        return createFallbackDisplay(dateString);
      }

      // Handle timestamp arrays that might be nested objects
      if (
        dateString &&
        typeof dateString === "object" &&
        "timestamp" in dateString
      ) {
        console.log("Found timestamp object:", dateString);
        return formatDateTime(dateString.timestamp);
      }

      // Handle ISO strings and other string formats
      if (typeof dateString === "string") {
        console.log("Processing string date:", dateString);
        const date = new Date(dateString);
        console.log(
          "Created date from string:",
          date.toString(),
          "Valid:",
          !isNaN(date.getTime())
        );

        if (!isNaN(date.getTime())) {
          const formattedDate = date.toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
          console.log("Formatted string date:", formattedDate);
          return formattedDate;
        }
      }

      console.warn("Unhandled date format:", typeof dateString, dateString);
      if (Array.isArray(dateString)) {
        return createFallbackDisplay(dateString);
      }
      return typeof dateString === "string" ? dateString : "Date not available";
    } catch (error) {
      console.error("Date formatting error:", error, dateString);
      if (Array.isArray(dateString)) {
        return createFallbackDisplay(dateString);
      }
      return "Date not available";
    }
  };

  // Helper function to get a consistent image index from any event ID
  const getImageIndex = (id) => {
    if (!id) return 1;

    try {
      // If the ID is a number or can be parsed as a hex value
      if (typeof id === "number") {
        return (id % 3) + 1;
      }

      // For string IDs
      if (typeof id === "string") {
        // Try to get some numerical value from the ID
        // Method 1: Parse as integer if possible
        if (!isNaN(parseInt(id))) {
          return (parseInt(id) % 3) + 1;
        }

        // Method 2: Add up character codes
        let sum = 0;
        for (let i = 0; i < id.length; i++) {
          sum += id.charCodeAt(i);
        }
        return (sum % 3) + 1;
      }

      // Default
      return 1;
    } catch (error) {
      console.error("Error determining image index:", error);
      return 1;
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ py: 8, textAlign: "center", width: "100%" }}>
          <Typography variant="h5" color="error">
            Error loading event: {error}
          </Typography>
          <Button
            sx={{ mt: 3 }}
            variant="contained"
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIcon />}
          >
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container>
        <Box sx={{ py: 8, textAlign: "center", width: "100%" }}>
          <Typography variant="h5">Event not found</Typography>
          <Button
            sx={{ mt: 3 }}
            variant="contained"
            onClick={() => navigate("/events")}
            startIcon={<ArrowBackIcon />}
          >
            Browse Events
          </Button>
        </Box>
      </Container>
    );
  }

  // Make the organizer check more permissive for testing - remove this in production
  const isOrganizer = true; /* In production, use this instead:
    user &&
    ((event.organizerId && user.id === event.organizerId) ||
     (event.organizer && user.id === event.organizer.id));
  */

  // Debug info to help troubleshoot why button isn't showing
  console.log("User:", user);
  console.log("Event:", event);
  console.log("Event date fields:", {
    startTime: event.startTime,
    endTime: event.endTime,
    startDate: event.startDate,
    endDate: event.endDate,
    createdAt: event.createdAt,
    updatedAt: event.updatedAt,
  });
  console.log("Event organizer info:", {
    organizerId: event.organizerId,
    organizer: event.organizer,
    isOrganizer: isOrganizer,
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={3}>
        <Button
          component={Link}
          to="/events"
          startIcon={<ArrowBackIcon />}
          variant="text"
          color="inherit"
        >
          Back to Events
        </Button>
      </Box>

      {loading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="300px"
        >
          <CircularProgress />
        </Box>
      )}

      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && event && (
        <>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <img
                src={`${
                  process.env.PUBLIC_URL
                }/images/events/event-${getImageIndex(event.id)}.avif`}
                alt={event.title}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                onError={(e) => {
                  console.log(
                    `Image load error for event ${event.id}, falling back to default`
                  );
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = `${process.env.PUBLIC_URL}/images/defaults/event-default.avif`;
                }}
              />

              {/* Add prominent registration button */}
              <Box mt={2} display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleRegisterClick}
                  startIcon={<EventIcon />}
                  fullWidth
                  sx={{
                    py: 1.5,
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    "&:hover": {
                      boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  Register Now
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 3,
                }}
              >
                <Typography variant="h4" component="h1" gutterBottom>
                  {event.title}
                </Typography>

                {user && user.id === event.organizer?.id && (
                  <Box>
                    <Button
                      onClick={handleEditClick}
                      color="primary"
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={handleDeleteClick}
                      color="error"
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Keep the rest of the content */}
              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Event Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">
                      <EventIcon
                        fontSize="small"
                        sx={{ mr: 1, verticalAlign: "middle" }}
                      />
                      Start:{" "}
                      {formatDateTime(event.startTime || event.startDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">
                      <EventIcon
                        fontSize="small"
                        sx={{ mr: 1, verticalAlign: "middle" }}
                      />
                      End: {formatDateTime(event.endTime || event.endDate)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <LocationOnIcon
                        fontSize="small"
                        sx={{ mr: 1, verticalAlign: "middle" }}
                      />
                      Location: {formatLocation(event.location)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <CategoryIcon
                        fontSize="small"
                        sx={{ mr: 1, verticalAlign: "middle" }}
                      />
                      Category: {event.category || "Uncategorized"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <PeopleIcon
                        fontSize="small"
                        sx={{ mr: 1, verticalAlign: "middle" }}
                      />
                      Capacity:{" "}
                      {event.maxAttendees
                        ? `${event.attendees?.length || 0}/${
                            event.maxAttendees
                          }`
                        : "Unlimited"}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      <AttachMoneyIcon
                        fontSize="small"
                        sx={{ mr: 1, verticalAlign: "middle" }}
                      />
                      Price:{" "}
                      {event.price ? `$${event.price.toFixed(2)}` : "Free"}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Description
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {event.description || "No description available."}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Event</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this event? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Register Dialog with Form */}
      <Dialog
        open={registerDialogOpen}
        onClose={handleRegisterCancel}
        aria-labelledby="register-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="register-dialog-title">
          Register for {event && event.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText paragraph sx={{ mb: 3 }}>
            Please fill out the form below to register for this event.
          </DialogContentText>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="firstName"
                value={registrationForm.firstName}
                onChange={handleRegistrationFormChange}
                fullWidth
                margin="dense"
                required
                error={!!formErrors.firstName}
                helperText={formErrors.firstName}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                name="lastName"
                value={registrationForm.lastName}
                onChange={handleRegistrationFormChange}
                fullWidth
                margin="dense"
                required
                error={!!formErrors.lastName}
                helperText={formErrors.lastName}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={registrationForm.email}
                onChange={handleRegistrationFormChange}
                fullWidth
                margin="dense"
                required
                error={!!formErrors.email}
                helperText={formErrors.email}
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={registrationForm.phoneNumber}
                onChange={handleRegistrationFormChange}
                fullWidth
                margin="dense"
                disabled={isSubmitting}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="dense">
                <InputLabel id="ticket-type-label">Ticket Type</InputLabel>
                <Select
                  labelId="ticket-type-label"
                  name="ticketType"
                  value={registrationForm.ticketType}
                  onChange={handleRegistrationFormChange}
                  label="Ticket Type"
                  disabled={isSubmitting}
                >
                  <MenuItem value="STANDARD">Standard</MenuItem>
                  <MenuItem value="VIP">VIP</MenuItem>
                  <MenuItem value="EARLY_BIRD">Early Bird</MenuItem>
                  <MenuItem value="GROUP">Group</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes or Special Requirements"
                name="notes"
                value={registrationForm.notes}
                onChange={handleRegistrationFormChange}
                fullWidth
                multiline
                rows={3}
                margin="dense"
                disabled={isSubmitting}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRegisterCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleRegisterConfirm}
            color="primary"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={24} /> : null}
          >
            {isSubmitting ? "Processing..." : "Complete Registration"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
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

export default EventDetailPage;
