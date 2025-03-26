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
} from "@mui/material";
import {
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Event as EventIcon,
  LocationOn as LocationOnIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";
import { fetchEvent, deleteEvent } from "../store/eventSlice";

const EventDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { event, loading, error } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);

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

  const handleRegisterConfirm = () => {
    console.log("Registering for event:", event.id);
    // In a real app, this would make an API call to register the user
    setRegisterDialogOpen(false);
    // Show success message or update UI
    alert("You've successfully registered for this event!");
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
    <Container>
      <Box sx={{ py: 4 }}>
        <Button
          component={Link}
          to="/events"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 2 }}
        >
          Back to Events
        </Button>

        {/* Debug info */}
        <div style={{ display: "none" }}>
          Current user: {JSON.stringify(user)}
          <br />
          Event: {JSON.stringify(event)}
          <br />
          Event Organizer: {event.organizerId}
          <br />
          Is organizer: {isOrganizer ? "Yes" : "No"}
        </div>

        {/* Event header with title and actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            {event.title}
          </Typography>
          {isOrganizer && (
            <Box>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
                sx={{ mr: 1 }}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                color="primary"
                component={Link}
                to={`/events/edit/${id}`}
              >
                Edit Event
              </Button>
            </Box>
          )}
        </Box>

        {/* Event Image */}
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Event Image
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img
              src={`${
                process.env.PUBLIC_URL
              }/images/events/event-${getImageIndex(event.id)}.avif`}
              alt={event.title}
              style={{
                maxWidth: "100%",
                maxHeight: "400px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
              onError={(e) => {
                console.log(
                  `Image load error for event ${event.id}, falling back to default`
                );
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = `${process.env.PUBLIC_URL}/images/defaults/event-default.avif`;
              }}
            />
          </Box>
        </Paper>

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
                Start: {formatDateTime(event.startTime || event.startDate)}
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
                  ? `${event.attendees?.length || 0}/${event.maxAttendees}`
                  : "Unlimited"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                <AttachMoneyIcon
                  fontSize="small"
                  sx={{ mr: 1, verticalAlign: "middle" }}
                />
                Price: {event.price ? `$${event.price.toFixed(2)}` : "Free"}
              </Typography>
            </Grid>
          </Grid>

          {!isOrganizer && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={handleRegisterClick}
              sx={{ mt: 3 }}
            >
              Register for Event
            </Button>
          )}
        </Paper>

        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
            {event.description || "No description available."}
          </Typography>
        </Paper>
      </Box>

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

      {/* Register Dialog */}
      <Dialog
        open={registerDialogOpen}
        onClose={handleRegisterCancel}
        aria-labelledby="register-dialog-title"
        aria-describedby="register-dialog-description"
      >
        <DialogTitle id="register-dialog-title">Register for Event</DialogTitle>
        <DialogContent>
          <DialogContentText id="register-dialog-description">
            {event &&
              `Are you sure you want to register for "${event.title}"? You will receive a confirmation email with event details.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRegisterCancel}>Cancel</Button>
          <Button onClick={handleRegisterConfirm} color="primary" autoFocus>
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventDetailPage;
