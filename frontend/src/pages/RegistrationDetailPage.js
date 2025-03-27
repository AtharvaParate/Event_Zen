import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from "@mui/material";
import {
  Event as EventIcon,
  Person as PersonIcon,
  CalendarToday,
  Receipt,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  LocalAtm,
  EventSeat,
} from "@mui/icons-material";
import registrationApi from "../api/registrationApi";
import PageContainer from "../components/common/PageContainer";

// Helper functions
const getPaymentStatusColor = (status) => {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "PENDING":
      return "warning";
    case "FAILED":
      return "error";
    case "REFUNDED":
      return "info";
    default:
      return "default";
  }
};

const getCheckInStatusColor = (status) => {
  switch (status) {
    case "CHECKED_IN":
      return "success";
    case "NOT_CHECKED_IN":
      return "warning";
    default:
      return "default";
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

// Check if we should use mock data - mirrors the API function
const shouldUseMockData = () => {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.REACT_APP_USE_MOCK_DATA === "true"
  );
};

const RegistrationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [checkinInProgress, setCheckinInProgress] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Fetch registration data
  useEffect(() => {
    const fetchRegistrationData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await registrationApi.fetchRegistrationById(id);
        console.log("Registration data fetched:", data);
        setRegistration(data);
      } catch (err) {
        console.error("Error fetching registration:", err);
        setError("Failed to load registration data. Please try again.");
        showMessage("Failed to load registration details", "error");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRegistrationData();
    } else {
      setError("No registration ID provided");
      setLoading(false);
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/registrations/edit/${id}`);
  };

  const handleBack = () => {
    navigate("/registrations");
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const executeDeleteRegistration = async () => {
    setDeleting(true);

    try {
      console.log(`Attempting to delete registration: ${id}`);
      await registrationApi.deleteRegistration(id);
      console.log(`Registration successfully deleted: ${id}`);

      showMessage("Registration deleted successfully", "success");

      // Navigate back after a short delay
      setTimeout(() => {
        navigate("/registrations");
      }, 1500);
    } catch (error) {
      console.error("Error deleting registration:", error);

      // In development mode with mock data, we'll proceed as if deleted
      if (shouldUseMockData()) {
        console.warn("In mock mode - proceeding as if deletion succeeded");

        showMessage("Registration deleted successfully (mock mode)", "success");

        // Navigate back after a short delay
        setTimeout(() => {
          navigate("/registrations");
        }, 1500);
      } else {
        showMessage(
          `Failed to delete registration: ${error.message || "Unknown error"}`,
          "error"
        );
        setShowDeleteDialog(false);
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleCheckInClick = () => {
    setShowCheckInDialog(true);
  };

  const handleConfirmCheckIn = async () => {
    setCheckinInProgress(true);

    try {
      console.log(`Processing check-in for registration ID: ${id}`);
      const updatedRegistration = await registrationApi.checkInRegistration(id);

      setRegistration(updatedRegistration);
      setShowCheckInDialog(false);
      showMessage("Registration checked in successfully", "success");
    } catch (err) {
      console.error("Error checking in registration:", err);

      // In mock mode
      if (shouldUseMockData()) {
        console.warn("In mock mode - proceeding as if check-in succeeded");

        // Update the registration locally
        setRegistration({
          ...registration,
          checkInStatus: "CHECKED_IN",
          checkInTime: new Date().toISOString(),
        });

        setShowCheckInDialog(false);
        showMessage(
          "Registration checked in successfully (mock mode)",
          "success"
        );
      } else {
        showMessage(
          `Failed to check in registration: ${err.message || "Unknown error"}`,
          "error"
        );
      }
    } finally {
      setCheckinInProgress(false);
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

  if (loading) {
    return (
      <PageContainer>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <Box sx={{ mt: 4, mb: 4 }}>
          <Alert severity="error">{error}</Alert>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
            >
              Back to Registrations
            </Button>
          </Box>
        </Box>
      </PageContainer>
    );
  }

  if (!registration) {
    return (
      <PageContainer>
        <Box sx={{ mt: 4, mb: 4 }}>
          <Alert severity="warning">Registration not found</Alert>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
            >
              Back to Registrations
            </Button>
          </Box>
        </Box>
      </PageContainer>
    );
  }

  const formattedRegistrationDate = formatDate(registration.registrationDate);
  const formattedCheckInTime = registration.checkInTime
    ? formatDate(registration.checkInTime)
    : "Not checked in";

  return (
    <PageContainer>
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          Back to Registrations
        </Button>

        <Typography variant="h4" component="h1" gutterBottom>
          Registration Details
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
            mb: 2,
          }}
        >
          <Chip
            label={`Confirmation: ${registration.confirmationNumber}`}
            variant="outlined"
          />
          <Chip
            label={registration.paymentStatus?.replace("_", " ") || "Unknown"}
            color={getPaymentStatusColor(registration.paymentStatus)}
          />
          <Chip
            label={
              registration.checkInStatus === "CHECKED_IN"
                ? "Checked In"
                : "Not Checked In"
            }
            color={getCheckInStatusColor(registration.checkInStatus)}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
          {registration.checkInStatus !== "CHECKED_IN" && (
            <Button
              variant="outlined"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={handleCheckInClick}
            >
              Check In
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Registration Details */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardHeader
              title="Registration Information"
              subheader={`Created on ${formattedRegistrationDate}`}
              avatar={<Receipt color="primary" />}
            />
            <Divider />
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Confirmation Number
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {registration.confirmationNumber}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Ticket Type
                </Typography>
                <Typography variant="body1">
                  {registration.ticketType || "Standard Ticket"}
                  {registration.ticketPrice && (
                    <Typography
                      component="span"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      ({formatCurrency(registration.ticketPrice)})
                    </Typography>
                  )}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Payment Information
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <LocalAtm fontSize="small" color="action" />
                  <Typography>
                    {registration.paymentMethod?.replace("_", " ") ||
                      "Unknown method"}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Check-in Status
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <EventSeat fontSize="small" color="action" />
                  <Typography>
                    {registration.checkInStatus === "CHECKED_IN"
                      ? `Checked in at ${formattedCheckInTime}`
                      : "Not checked in"}
                  </Typography>
                </Box>
              </Box>

              {registration.notes && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Notes
                  </Typography>
                  <Typography variant="body1">{registration.notes}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Attendee Information */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardHeader
              title="Attendee Information"
              avatar={<PersonIcon color="primary" />}
            />
            <Divider />
            <CardContent>
              {registration.attendee ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      {`${registration.attendee.firstName} ${registration.attendee.lastName}`}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {registration.attendee.email}
                    </Typography>
                  </Box>

                  {registration.attendee.phone && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1">
                        {registration.attendee.phone}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        navigate(`/attendees/${registration.attendee.id}`)
                      }
                    >
                      View Attendee Details
                    </Button>
                  </Box>
                </>
              ) : (
                <Typography color="text.secondary">
                  Attendee information not available
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Event Information */}
          <Card variant="outlined">
            <CardHeader
              title="Event Information"
              avatar={<EventIcon color="primary" />}
            />
            <Divider />
            <CardContent>
              {registration.event ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Event Name
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      {registration.event.name || registration.event.title}
                    </Typography>
                  </Box>

                  {registration.event.location && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Location
                      </Typography>
                      <Typography variant="body1">
                        {registration.event.location}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Event Date
                    </Typography>
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <CalendarToday fontSize="small" color="action" />
                      <Typography variant="body1">
                        {formatDate(registration.event.startDate)} -
                        {formatDate(registration.event.endDate)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() =>
                        navigate(`/events/${registration.event.id}`)
                      }
                    >
                      View Event Details
                    </Button>
                  </Box>
                </>
              ) : (
                <Typography color="text.secondary">
                  Event information not available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">
              {registration.attendee
                ? `${registration.attendee.firstName} ${registration.attendee.lastName}`
                : "Unknown Attendee"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Event:{" "}
              {registration.event
                ? registration.event.name || registration.event.title
                : "Unknown Event"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Confirmation: {registration.confirmationNumber}
            </Typography>
          </Box>
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
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">
              {registration.attendee
                ? `${registration.attendee.firstName} ${registration.attendee.lastName}`
                : "Unknown Attendee"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Event:{" "}
              {registration.event
                ? registration.event.name || registration.event.title
                : "Unknown Event"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Confirmation: {registration.confirmationNumber}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCheckInDialog(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmCheckIn}
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
    </PageContainer>
  );
};

export default RegistrationDetailPage;
