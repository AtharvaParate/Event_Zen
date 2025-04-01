import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Avatar,
  List,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  ArrowBack,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday,
  LocationOn,
  Info,
} from "@mui/icons-material";
import {
  fetchAttendeeById,
  fetchRegistrationsByAttendeeId,
  deleteAttendee,
  updateAttendee,
} from "../api/attendeeApi";
import { fetchEvents } from "../api/eventApi";
import { format } from "date-fns";
import AttendeeForm from "../components/forms/AttendeeForm";

const getStatusColor = (status) => {
  switch (status) {
    case "REGISTERED":
      return "success";
    case "PENDING":
      return "warning";
    case "CHECKED_IN":
      return "info";
    case "CANCELLED":
      return "error";
    default:
      return "default";
  }
};

const AttendeeDetailPage = ({ edit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attendee, setAttendee] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    loadAttendeeDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadAttendeeDetails = async () => {
    setLoading(true);
    setError(null);
    console.log(
      `Loading details for attendee with ID: ${id}, edit mode: ${edit}`
    );

    try {
      // Fetch the attendee details
      console.log(`Fetching attendee with ID: ${id}`);
      const attendeeData = await fetchAttendeeById(id);
      console.log("Attendee data received:", attendeeData);

      if (!attendeeData) {
        throw new Error("No attendee data returned from API");
      }

      setAttendee(attendeeData);

      // Fetch related registrations
      try {
        console.log(`Fetching registrations for attendee ID: ${id}`);
        const regsData = await fetchRegistrationsByAttendeeId(id);
        console.log("Registration data received:", regsData);

        // Handle both array and paginated response formats
        if (Array.isArray(regsData)) {
          setRegistrations(regsData);
        } else if (regsData && regsData.content) {
          setRegistrations(regsData.content);
        } else if (regsData) {
          // If it's an object but doesn't have a content property, wrap it in an array
          setRegistrations([regsData]);
        } else {
          setRegistrations([]);
        }
      } catch (regError) {
        console.error("Error fetching registrations:", regError);
        setRegistrations([]);
      }

      // Fetch events data
      try {
        console.log("Fetching events data");
        const eventsData = await fetchEvents();
        console.log("Events data received:", eventsData);

        const eventsMap = {};

        // Handle both array and paginated response formats
        const eventsContent = Array.isArray(eventsData)
          ? eventsData
          : eventsData.content || [];

        eventsContent.forEach((event) => {
          eventsMap[event.id] = event;
        });
        console.log("Events map created:", eventsMap);
        setEvents(eventsMap);
      } catch (eventError) {
        console.error("Error fetching events:", eventError);
        setEvents({});
      }
    } catch (err) {
      console.error("Error loading attendee details:", err);
      setError(
        `Failed to load attendee details: ${err.message || "Unknown error"}`
      );

      // In development mode, create a mock attendee
      if (process.env.NODE_ENV === "development") {
        console.warn("Using mock attendee data for development");
        const mockAttendee = {
          id: id,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phoneNumber: "123-456-7890",
          status: "REGISTERED",
          createdAt: new Date().toISOString(),
        };

        const mockRegistrations = [
          {
            id: "reg-1",
            attendeeId: id,
            eventId: "event-1",
            confirmationNumber: "CNF123456",
            registrationDate: new Date().toISOString(),
            ticketType: "VIP",
            ticketPrice: 150,
            paymentMethod: "CREDIT_CARD",
            paymentStatus: "PAID",
            checkInStatus: "CHECKED_IN",
          },
          {
            id: "reg-2",
            attendeeId: id,
            eventId: "event-2",
            confirmationNumber: "CNF789012",
            registrationDate: new Date().toISOString(),
            ticketType: "STANDARD",
            ticketPrice: 75,
            paymentMethod: "PAYPAL",
            paymentStatus: "PENDING",
            checkInStatus: "NOT_CHECKED_IN",
          },
        ];

        const mockEvents = {
          "event-1": {
            id: "event-1",
            title: "Annual Tech Conference",
            description: "A conference for tech enthusiasts",
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 86400000).toISOString(),
            location: "San Francisco, CA",
          },
          "event-2": {
            id: "event-2",
            title: "Music Festival",
            description: "A festival featuring various artists",
            startDate: new Date(Date.now() + 172800000).toISOString(),
            endDate: new Date(Date.now() + 259200000).toISOString(),
            location: "Los Angeles, CA",
          },
        };

        console.log("Setting mock data:", {
          mockAttendee,
          mockRegistrations,
          mockEvents,
        });
        setAttendee(mockAttendee);
        setRegistrations(mockRegistrations);
        setEvents(mockEvents);

        // Show a warning message to the user
        showMessage("Using mock data - backend connection failed", "warning");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle back button click
  const handleBack = () => {
    navigate(-1);
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (err) {
      return "Unknown date";
    }
  };

  // Get event details for a registration
  const getEventDetails = (eventId) => {
    return (
      events[eventId] || {
        title: "Unknown Event",
        startDate: null,
        location: "Unknown Location",
      }
    );
  };

  // Handle edit submission
  const handleEditSubmit = async (formData) => {
    setFormSubmitting(true);
    setError(null);

    try {
      if (!id) {
        throw new Error("No attendee ID provided for update");
      }

      console.log("Updating attendee with ID:", id);
      console.log("Update data:", formData);

      // Call the updateAttendee API function
      const updatedAttendee = await updateAttendee(id, formData);
      console.log("Update result:", updatedAttendee);

      // Show success message
      showMessage(
        `Attendee ${formData.firstName} ${formData.lastName} updated successfully`,
        "success"
      );

      // Force navigation immediately to the detail view
      console.log(`Navigating to attendee detail page: /attendees/${id}`);
      navigate(`/attendees/${id}`, { replace: true });
    } catch (err) {
      console.error("Error updating attendee:", err);
      setError(`Failed to update attendee: ${err.message || "Unknown error"}`);
      showMessage("Failed to update attendee", "error");

      // In development mode, simulate success
      if (process.env.NODE_ENV === "development") {
        console.warn("Using mock update in development mode");
        showMessage("Development mode: Attendee mock updated", "warning");
        
        // Force navigation to detail view
        console.log(`Navigating to attendee detail page: /attendees/${id}`);
        navigate(`/attendees/${id}`, { replace: true });
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  // Cancel edit
  const handleCancel = () => {
    console.log(`Canceling edit for attendee ${id}`);
    try {
      // Navigate back to the detail view
      navigate(`/attendees/${id}`);
    } catch (err) {
      console.error("Error navigating after cancel:", err);
      // Fallback to navigate back
      navigate(-1);
    }
  };

  // Function to show a snackbar message
  const showMessage = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Function to close the snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    setFormSubmitting(true);
    try {
      console.log(`Deleting attendee with ID: ${id}`);

      if (!id) {
        throw new Error("No attendee ID provided for deletion");
      }

      // Call the deleteAttendee API function
      const result = await deleteAttendee(id);
      console.log("Delete result:", result);

      // Show success message
      showMessage(
        `Attendee ${attendee.firstName} ${attendee.lastName} deleted successfully`,
        "success"
      );

      // Close dialog
      setDeleteDialogOpen(false);

      // Navigate back to attendees list after a short delay to allow the user to see the success message
      setTimeout(() => {
        navigate("/attendees");
      }, 1500);
    } catch (err) {
      console.error("Error deleting attendee:", err);

      // Show error message but keep dialog open to allow retry
      setError(`Failed to delete attendee: ${err.message || "Unknown error"}`);
      showMessage("Failed to delete attendee", "error");

      // Provide mock success in development mode
      if (process.env.NODE_ENV === "development") {
        console.warn("Using mock deletion in development mode");
        showMessage(
          `Development mode: Attendee ${attendee.firstName} ${attendee.lastName} mock deleted`,
          "warning"
        );
        setDeleteDialogOpen(false);

        // Navigate back after a delay
        setTimeout(() => {
          navigate("/attendees");
        }, 1500);
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>
          {edit
            ? "Loading attendee for editing..."
            : "Loading attendee details..."}
        </Typography>
      </Container>
    );
  }

  if (error && !attendee) {
    return (
      <Container sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={handleBack}>
          Back to Attendees
        </Button>
      </Container>
    );
  }

  if (!attendee) {
    return (
      <Container sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Attendee not found
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={handleBack}>
          Back to Attendees
        </Button>
      </Container>
    );
  }

  // If in edit mode, show the edit form
  if (edit) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4">Edit Attendee</Typography>
          <Button startIcon={<ArrowBack />} onClick={handleCancel}>
            Cancel
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <AttendeeForm
            initialValues={attendee}
            onSubmit={handleEditSubmit}
            isLoading={formSubmitting}
            submitButtonText="Update Attendee"
            isEdit={true}
          />
        </Paper>
      </Container>
    );
  }

  // Otherwise show the detail view
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mb: 2 }}>
        Back to Attendees
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4">Attendee Details</Typography>
          <Box>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EditIcon />}
              sx={{ mr: 1 }}
              onClick={() => {
                try {
                  if (!attendee || !attendee.id) {
                    throw new Error("No valid attendee to edit");
                  }
                  const editUrl = `/attendees/edit/${attendee.id}`;
                  console.log(`Navigating to edit page at URL: ${editUrl}`);
                  showMessage("Navigating to edit page...", "info");
                  // Use a short timeout to ensure navigation happens after state updates
                  setTimeout(() => {
                    navigate(editUrl);
                  }, 100);
                } catch (err) {
                  console.error("Error navigating to edit page:", err);
                  showMessage(
                    `Error navigating to edit page: ${err.message}`,
                    "error"
                  );
                }
              }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => {
                try {
                  if (!attendee || !attendee.id) {
                    throw new Error("No valid attendee to delete");
                  }
                  console.log(
                    `Opening delete dialog for attendee: ${attendee.id}`
                  );
                  setDeleteDialogOpen(true);
                } catch (err) {
                  console.error("Error opening delete dialog:", err);
                  showMessage(
                    `Error preparing for deletion: ${err.message}`,
                    "error"
                  );
                }
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: 48,
                  bgcolor: "primary.main",
                  mb: 2,
                }}
              >
                {attendee.firstName?.charAt(0).toUpperCase() || <Person />}
              </Avatar>

              <Typography variant="h5" gutterBottom>
                {attendee.firstName} {attendee.lastName}
              </Typography>

              <Chip
                label={attendee.status || "REGISTERED"}
                color={getStatusColor(attendee.status)}
                sx={{ mb: 2 }}
              />

              {attendee.createdAt && (
                <Typography variant="body2" color="text.secondary">
                  Registered on: {formatDate(attendee.createdAt)}
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center">
                      <Email color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1" fontWeight="medium">
                        Email:
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{ mt: 1, wordBreak: "break-all" }}
                    >
                      {attendee.email}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box display="flex" alignItems="center">
                      <Phone color="primary" sx={{ mr: 1 }} />
                      <Typography variant="body1" fontWeight="medium">
                        Phone:
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      {attendee.phoneNumber || attendee.phone || "Not provided"}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            <Typography variant="h6" gutterBottom>
              Event Registrations ({registrations.length})
            </Typography>

            {registrations.length === 0 ? (
              <Paper variant="outlined" sx={{ p: 3, textAlign: "center" }}>
                <Info
                  color="action"
                  sx={{ fontSize: 48, mb: 1, opacity: 0.5 }}
                />
                <Typography>
                  This attendee has not registered for any events yet.
                </Typography>
              </Paper>
            ) : (
              <List>
                {registrations.map((registration) => {
                  const event = getEventDetails(registration.eventId);
                  return (
                    <Card key={registration.id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={8}>
                            <Typography variant="h6">{event.title}</Typography>

                            <Box display="flex" alignItems="center" mt={1}>
                              <CalendarToday
                                fontSize="small"
                                sx={{ mr: 1, color: "text.secondary" }}
                              />
                              <Typography variant="body2">
                                {event.startDate
                                  ? formatDate(event.startDate)
                                  : "Date not available"}
                              </Typography>
                            </Box>

                            <Box display="flex" alignItems="center" mt={1}>
                              <LocationOn
                                fontSize="small"
                                sx={{ mr: 1, color: "text.secondary" }}
                              />
                              <Typography variant="body2">
                                {event.location}
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={12} sm={4}>
                            <Box
                              display="flex"
                              flexDirection="column"
                              alignItems="flex-end"
                            >
                              <Chip
                                label={`Registration: ${registration.confirmationNumber}`}
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ mb: 1 }}
                              />

                              <Chip
                                label={`Ticket: ${registration.ticketType}`}
                                size="small"
                                sx={{ mb: 1 }}
                              />

                              <Chip
                                label={`Payment: ${registration.paymentStatus}`}
                                size="small"
                                color={
                                  registration.paymentStatus === "PAID"
                                    ? "success"
                                    : "warning"
                                }
                                sx={{ mb: 1 }}
                              />

                              <Chip
                                label={`Check-in: ${
                                  registration.checkInStatus === "CHECKED_IN"
                                    ? "Checked In"
                                    : "Not Checked In"
                                }`}
                                size="small"
                                color={
                                  registration.checkInStatus === "CHECKED_IN"
                                    ? "success"
                                    : "default"
                                }
                              />
                            </Box>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  );
                })}
              </List>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => !formSubmitting && setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        keepMounted={false}
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          {attendee ? (
            <DialogContentText id="delete-dialog-description">
              Are you sure you want to delete attendee{" "}
              <strong>
                {attendee.firstName} {attendee.lastName}
              </strong>
              ? This action cannot be undone and will remove all associated
              data.
            </DialogContentText>
          ) : (
            <DialogContentText color="error">
              Error: No attendee data available for deletion.
            </DialogContentText>
          )}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={formSubmitting}
            color="inherit"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            disabled={formSubmitting || !attendee}
            variant="contained"
            autoFocus
          >
            {formSubmitting ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AttendeeDetailPage;
