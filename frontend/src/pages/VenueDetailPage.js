import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Divider,
  Chip,
  Card,
  CardMedia,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Event as EventIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Add as AddIcon,
  DateRange as DateRangeIcon,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, addHours, parseISO } from "date-fns";
import {
  fetchVenueById,
  updateVenue,
  deleteVenue,
  checkVenueAvailability,
} from "../api/venueApi";

const VenueDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State variables
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [bookingDate, setBookingDate] = useState(new Date());
  const [availabilityData, setAvailabilityData] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Mock upcoming events at the venue
  const [upcomingEvents] = useState([
    {
      id: "event-1",
      title: "Corporate Conference",
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      startTime: "09:00",
      endTime: "17:00",
      status: "CONFIRMED",
    },
    {
      id: "event-2",
      title: "Wedding Reception",
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      startTime: "18:00",
      endTime: "23:00",
      status: "CONFIRMED",
    },
    {
      id: "event-3",
      title: "Product Launch",
      date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      startTime: "13:00",
      endTime: "16:00",
      status: "PENDING",
    },
  ]);

  // Load venue details on mount
  useEffect(() => {
    loadVenueDetails();
  }, [id]);

  // Function to load venue details
  const loadVenueDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchVenueById(id);
      setVenue(data);
    } catch (err) {
      console.error("Error loading venue details:", err);
      setError("Failed to load venue details. Please try again.");
      showMessage("Failed to load venue details", "error");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Function to check venue availability
  const handleCheckAvailability = async () => {
    if (!bookingDate) return;

    setCheckingAvailability(true);

    try {
      const formattedDate = format(bookingDate, "yyyy-MM-dd");
      const data = await checkVenueAvailability(id, formattedDate);
      setAvailabilityData(data);

      if (data.available) {
        showMessage("Venue is available on the selected date!", "success");
      } else {
        showMessage("Venue is not available on the selected date.", "warning");
      }
    } catch (err) {
      console.error("Error checking availability:", err);
      showMessage("Failed to check availability. Please try again.", "error");
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Function to handle venue deletion
  const handleDeleteVenue = async () => {
    setFormSubmitting(true);

    try {
      await deleteVenue(id);
      showMessage("Venue deleted successfully", "success");

      // Navigate back to venues list after a delay
      setTimeout(() => {
        navigate("/venues");
      }, 1500);
    } catch (err) {
      console.error("Error deleting venue:", err);
      showMessage("Failed to delete venue. Please try again.", "error");
      setDeleteDialogOpen(false);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Function to show snackbar message
  const showMessage = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Function to handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Function to format date for display
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "MMM d, yyyy");
    } catch (err) {
      return "Unknown date";
    }
  };

  // Function to format time for display
  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(":");
      return new Date(0, 0, 0, hours, minutes).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (err) {
      return timeString;
    }
  };

  // Loading state
  if (loading && !venue) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Error state
  if (error && !venue) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/venues")}
          sx={{ mb: 2 }}
        >
          Back to Venues
        </Button>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Back button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/venues")}
        sx={{ mb: 2 }}
      >
        Back to Venues
      </Button>

      {/* Venue header */}
      <Paper
        sx={{
          p: 3,
          mb: 4,
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${
            venue?.images?.[0] ||
            "https://source.unsplash.com/random/1200x400/?venue"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          position: "relative",
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Typography variant="h3" gutterBottom>
            {venue?.name}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <LocationIcon sx={{ mr: 1 }} />
            <Typography variant="h6">{venue?.location}</Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
            <Chip
              icon={<PeopleIcon />}
              label={`Capacity: ${venue?.capacity} guests`}
              color="primary"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.8)",
                color: "text.primary",
              }}
            />
            <Chip
              icon={<MoneyIcon />}
              label={`$${venue?.pricePerHour}/hour`}
              color="primary"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.8)",
                color: "text.primary",
              }}
            />
            <Chip
              icon={venue?.availability ? <CheckCircleIcon /> : <WarningIcon />}
              label={venue?.availability ? "Available" : "Unavailable"}
              color={venue?.availability ? "success" : "error"}
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.8)",
                color: "text.primary",
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Details" />
          <Tab label="Availability" />
          <Tab label="Upcoming Events" />
        </Tabs>

        {/* Details Tab */}
        {currentTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Typography variant="h5" gutterBottom>
                  About this Venue
                </Typography>
                <Typography variant="body1" paragraph>
                  {venue?.description || "No description provided."}
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Amenities
                </Typography>

                {venue?.amenities && venue.amenities.length > 0 ? (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {venue.amenities.map((amenity, index) => (
                      <Chip
                        key={index}
                        label={amenity}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No amenities listed.
                  </Typography>
                )}

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/venues/edit/${id}`)}
                  >
                    Edit Venue
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete Venue
                  </Button>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      venue?.images?.[0] ||
                      "https://source.unsplash.com/random/400x200/?venue"
                    }
                    alt={venue?.name}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Quick Info
                    </Typography>

                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Capacity"
                          secondary={`${venue?.capacity} guests`}
                        />
                      </ListItem>

                      <ListItem>
                        <ListItemIcon>
                          <MoneyIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Hourly Rate"
                          secondary={`$${venue?.pricePerHour}`}
                        />
                      </ListItem>

                      <ListItem>
                        <ListItemIcon>
                          <LocationIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Location"
                          secondary={venue?.location}
                        />
                      </ListItem>

                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon
                            color={venue?.availability ? "success" : "error"}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary="Status"
                          secondary={
                            venue?.availability
                              ? "Available for booking"
                              : "Currently unavailable"
                          }
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Availability Tab */}
        {currentTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Check Availability
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Select Date"
                    value={bookingDate}
                    onChange={(newValue) => {
                      setBookingDate(newValue);
                      setAvailabilityData(null);
                    }}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                    minDate={new Date()}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid
                item
                xs={12}
                md={6}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCheckAvailability}
                  disabled={checkingAvailability || !bookingDate}
                  sx={{ height: "56px" }}
                  fullWidth
                >
                  {checkingAvailability ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Check Availability"
                  )}
                </Button>
              </Grid>
            </Grid>

            {availabilityData && (
              <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  {availabilityData.available ? (
                    <CheckCircleIcon
                      color="success"
                      sx={{ mr: 1, fontSize: 30 }}
                    />
                  ) : (
                    <WarningIcon color="error" sx={{ mr: 1, fontSize: 30 }} />
                  )}

                  <Typography variant="h6">
                    {availabilityData.available
                      ? "Venue is available on this date!"
                      : "Venue is not available on this date."}
                  </Typography>
                </Box>

                {availabilityData.available &&
                  availabilityData.availableTimeSlots && (
                    <>
                      <Typography variant="subtitle1" sx={{ mt: 2 }}>
                        Available Time Slots:
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        {availabilityData.availableTimeSlots.map(
                          (timeSlot, index) => (
                            <Chip
                              key={index}
                              label={timeSlot}
                              variant="outlined"
                              color="primary"
                              icon={<TimeIcon />}
                            />
                          )
                        )}
                      </Box>

                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<EventIcon />}
                        sx={{ mt: 3 }}
                        onClick={() =>
                          navigate(
                            `/events/create?venueId=${id}&date=${format(
                              bookingDate,
                              "yyyy-MM-dd"
                            )}`
                          )
                        }
                      >
                        Book this Venue
                      </Button>
                    </>
                  )}
              </Paper>
            )}

            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Booking Instructions
            </Typography>

            <Typography variant="body1" paragraph>
              To book this venue, check the availability for your desired date
              and click the "Book this Venue" button. You'll be directed to
              create an event at this venue on the selected date.
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Standard booking requires a 50% deposit. Cancellations made more
              than 30 days before the event receive a full refund. Cancellations
              made 15-30 days before the event receive a 50% refund. No refunds
              for cancellations made less than 15 days before the event.
            </Typography>
          </Box>
        )}

        {/* Upcoming Events Tab */}
        {currentTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h5">
                Upcoming Events at this Venue
              </Typography>

              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => navigate(`/events/create?venueId=${id}`)}
              >
                Create Event
              </Button>
            </Box>

            {upcomingEvents.length === 0 ? (
              <Alert severity="info" sx={{ mb: 3 }}>
                No upcoming events scheduled at this venue.
              </Alert>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Event</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {upcomingEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.title}</TableCell>
                        <TableCell>{formatDate(event.date)}</TableCell>
                        <TableCell>{`${formatTime(
                          event.startTime
                        )} - ${formatTime(event.endTime)}`}</TableCell>
                        <TableCell>
                          <Chip
                            label={event.status}
                            color={
                              event.status === "CONFIRMED"
                                ? "success"
                                : "warning"
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Event Details">
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/events/${event.id}`)}
                            >
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !formSubmitting && setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{venue?.name}</strong>? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={formSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteVenue}
            color="error"
            disabled={formSubmitting}
          >
            {formSubmitting ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default VenueDetailPage;
