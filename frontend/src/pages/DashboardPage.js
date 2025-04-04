import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Tab,
  Tabs,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CardMedia,
  Container,
  CircularProgress,
  Avatar,
  CardHeader,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import TicketIcon from "@mui/icons-material/ConfirmationNumber";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import RefreshIcon from "@mui/icons-material/Refresh";
import MoreVertIcon from "@mui/icons-material/MoreVert";
// eslint-disable-next-line no-unused-vars
import { fetchEvents, deleteEvent } from "../store/eventSlice";
import PageHeader from "../components/common/PageHeader";
import Loading from "../components/common/Loading";
// eslint-disable-next-line no-unused-vars
import { getImageUrl, getFallbackImage } from "../utils/imageUtils";
import { SafeSlide } from "../components/common/SafeTransition";
import PageContainer from "../components/common/PageContainer";
import { fetchAttendees } from "../api/attendeeApi";
import { fetchRegistrations } from "../api/registrationApi";
import { useTheme } from "@mui/material/styles";

// Custom transition component to prevent scrollTop errors
const Transition = React.forwardRef(function Transition(props, ref) {
  return <SafeSlide direction="up" ref={ref} {...props} />;
});

// Custom TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const StatCard = ({ title, count, icon, color, loading, linkTo }) => {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <Typography variant="h3" component="div">
                {count}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color }}>{icon}</Avatar>
        </Box>
      </CardContent>
      {linkTo && (
        <Box sx={{ p: 1, borderTop: "1px solid", borderColor: "divider" }}>
          <Button
            component={RouterLink}
            to={linkTo}
            size="small"
            sx={{ textTransform: "none" }}
          >
            View all
          </Button>
        </Box>
      )}
    </Card>
  );
};

const RecentItemsList = ({
  title,
  items,
  loading,
  error,
  noItemsText,
  renderItem,
  linkTo,
}) => {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardHeader
        title={title}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
      />
      <Divider />
      <CardContent sx={{ flexGrow: 1, overflow: "auto", maxHeight: 300 }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        ) : items.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ p: 2, textAlign: "center" }}
          >
            {noItemsText}
          </Typography>
        ) : (
          <List disablePadding>
            {items.map((item, index) => (
              <React.Fragment key={item.id || index}>
                {index > 0 && <Divider />}
                {renderItem(item)}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
      {linkTo && (
        <Box sx={{ p: 1, borderTop: "1px solid", borderColor: "divider" }}>
          <Button
            component={RouterLink}
            to={linkTo}
            size="small"
            sx={{ textTransform: "none" }}
          >
            View all
          </Button>
        </Box>
      )}
    </Card>
  );
};

const DashboardPage = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    events,
    attendingEvents,
    loading: reduxLoading,
  } = useSelector((state) => state.events);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState({
    events: false,
    attendees: false,
    registrations: false,
  });
  const [error, setError] = useState({
    events: null,
    attendees: null,
    registrations: null,
  });

  useEffect(() => {
    // Fetch user's events
    dispatch(fetchEvents({ userId: user?.id }));

    // Fetch events user is attending (You can add this later when API supports it)
    // For now, you can simulate it by fetching all events
    // In a real app, you'd have an endpoint like /api/users/{userId}/attending
    // or pass a parameter like { attending: true, userId: user?.id }
    if (user?.id) {
      // Use fetchEvents with different parameters when API supports this
      dispatch(fetchEvents({})); // Will be replaced with proper query when available
    }

    // Initialize events from Redux state
    setEvents(events || []);

    // Call our dashboard data loading function
    loadDashboardData();
  }, [dispatch, user, events]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDeleteEvent = (eventId) => {
    setEventToDelete(eventId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteEvent(eventToDelete)).unwrap();
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    } catch (error) {
      console.error("Failed to delete event:", error);
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Calculate statistics
  const upcomingEvents = events.filter(
    (event) => new Date(event.startDate) > new Date()
  ).length;
  const checkedInAttendees = attendees.filter(
    (attendee) => attendee.status === "CHECKED_IN"
  ).length;
  const paidRegistrations = registrations.filter(
    (reg) => reg.paymentStatus === "PAID"
  ).length;

  // Get percentage of paid registrations
  const paidPercentage =
    registrations.length > 0
      ? Math.round((paidRegistrations / registrations.length) * 100)
      : 0;

  const loadDashboardData = async () => {
    // Load events
    try {
      setLoading((prev) => ({ ...prev, events: true }));
      const eventsData = await fetchEvents();
      setEvents(eventsData.content || []);
      setError((prev) => ({ ...prev, events: null }));
    } catch (err) {
      console.error("Error loading events:", err);
      setError((prev) => ({ ...prev, events: "Failed to load events" }));
    } finally {
      setLoading((prev) => ({ ...prev, events: false }));
    }

    // Load attendees
    try {
      setLoading((prev) => ({ ...prev, attendees: true }));
      const attendeesData = await fetchAttendees();
      setAttendees(attendeesData.content || []);
      setError((prev) => ({ ...prev, attendees: null }));
    } catch (err) {
      console.error("Error loading attendees:", err);
      setError((prev) => ({ ...prev, attendees: "Failed to load attendees" }));
    } finally {
      setLoading((prev) => ({ ...prev, attendees: false }));
    }

    // Load registrations
    try {
      setLoading((prev) => ({ ...prev, registrations: true }));
      const registrationsData = await fetchRegistrations();
      setRegistrations(registrationsData.content || []);
      setError((prev) => ({ ...prev, registrations: null }));
    } catch (err) {
      console.error("Error loading registrations:", err);
      setError((prev) => ({
        ...prev,
        registrations: "Failed to load registrations",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, registrations: false }));
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [refresh]);

  const handleRefresh = () => {
    setRefresh((prev) => prev + 1);
  };

  if (loading.events) {
    return <Loading message="Loading your dashboard..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader
        title={`Welcome, ${user?.firstName || "User"}!`}
        subtitle="Manage your events and profile"
        actionText="Create Event"
        actionIcon={<AddIcon />}
        actionLink="/events/create"
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <IconButton onClick={handleRefresh} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Events"
            count={events.length}
            icon={<EventIcon />}
            color={theme.palette.primary.main}
            loading={loading.events}
            linkTo="/events"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Attendees"
            count={attendees.length}
            icon={<PeopleIcon />}
            color={theme.palette.secondary.main}
            loading={loading.attendees}
            linkTo="/attendees"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Registrations"
            count={registrations.length}
            icon={<TicketIcon />}
            color={theme.palette.success.main}
            loading={loading.registrations}
            linkTo="/registrations"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Paid Registrations"
            count={`${paidPercentage}%`}
            icon={<TrendingUpIcon />}
            color={theme.palette.info.main}
            loading={loading.registrations}
          />
        </Grid>
      </Grid>

      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Events" />
          <Tab label="Attendees" />
          <Tab label="Registrations" />
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        {tabValue === 0 && (
          <>
            <Grid item xs={12} md={6}>
              <RecentItemsList
                title="Upcoming Events"
                items={events
                  .filter((event) => new Date(event.startDate) > new Date())
                  .slice(0, 5)}
                loading={loading.events}
                error={error.events}
                noItemsText="No upcoming events"
                linkTo="/events"
                renderItem={(event) => (
                  <ListItem
                    alignItems="flex-start"
                    component={RouterLink}
                    to={`/events/${event.id}`}
                    sx={{ textDecoration: "none", color: "inherit" }}
                  >
                    <ListItemText
                      primary={event.title}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(event.startDate).toLocaleDateString()} -{" "}
                            {event.location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {event.capacity
                              ? `Capacity: ${event.capacity}`
                              : "Unlimited capacity"}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RecentItemsList
                title="Recent Events"
                items={events
                  .filter((event) => new Date(event.endDate) < new Date())
                  .slice(0, 5)}
                loading={loading.events}
                error={error.events}
                noItemsText="No recent events"
                linkTo="/events"
                renderItem={(event) => (
                  <ListItem
                    alignItems="flex-start"
                    component={RouterLink}
                    to={`/events/${event.id}`}
                    sx={{ textDecoration: "none", color: "inherit" }}
                  >
                    <ListItemText
                      primary={event.title}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(event.endDate).toLocaleDateString()} -{" "}
                            {event.location}
                          </Typography>
                          <Typography variant="body2" color="text.primary">
                            {event.status === "COMPLETED"
                              ? "Completed"
                              : event.status}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                )}
              />
            </Grid>
          </>
        )}

        {tabValue === 1 && (
          <>
            <Grid item xs={12} md={6}>
              <RecentItemsList
                title="Recent Attendees"
                items={attendees.slice(0, 5)}
                loading={loading.attendees}
                error={error.attendees}
                noItemsText="No attendees"
                linkTo="/attendees"
                renderItem={(attendee) => (
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={`${attendee.firstName} ${attendee.lastName}`}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {attendee.email}
                          </Typography>
                          <Typography variant="body2" color="text.primary">
                            Status: {attendee.status}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RecentItemsList
                title="Checked-In Attendees"
                items={attendees
                  .filter((attendee) => attendee.status === "CHECKED_IN")
                  .slice(0, 5)}
                loading={loading.attendees}
                error={error.attendees}
                noItemsText="No checked-in attendees"
                linkTo="/attendees"
                renderItem={(attendee) => (
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={`${attendee.firstName} ${attendee.lastName}`}
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            {attendee.email}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {attendee.phoneNumber}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                )}
              />
            </Grid>
          </>
        )}

        {tabValue === 2 && (
          <>
            <Grid item xs={12} md={6}>
              <RecentItemsList
                title="Recent Registrations"
                items={registrations.slice(0, 5)}
                loading={loading.registrations}
                error={error.registrations}
                noItemsText="No registrations"
                linkTo="/registrations"
                renderItem={(registration) => {
                  const event = events.find(
                    (e) => e.id === registration.eventId
                  );
                  const attendee = attendees.find(
                    (a) => a.id === registration.attendeeId
                  );
                  return (
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={`${
                          attendee
                            ? `${attendee.firstName} ${attendee.lastName}`
                            : "Unknown Attendee"
                        }`}
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              Event: {event ? event.title : "Unknown Event"}
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                              Payment: {registration.paymentStatus} | Check-in:{" "}
                              {registration.checkInStatus}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  );
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RecentItemsList
                title="Paid Registrations"
                items={registrations
                  .filter((reg) => reg.paymentStatus === "PAID")
                  .slice(0, 5)}
                loading={loading.registrations}
                error={error.registrations}
                noItemsText="No paid registrations"
                linkTo="/registrations"
                renderItem={(registration) => {
                  const event = events.find(
                    (e) => e.id === registration.eventId
                  );
                  const attendee = attendees.find(
                    (a) => a.id === registration.attendeeId
                  );
                  return (
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={`${
                          attendee
                            ? `${attendee.firstName} ${attendee.lastName}`
                            : "Unknown Attendee"
                        }`}
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary">
                              Event: {event ? event.title : "Unknown Event"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Confirmation: {registration.confirmationNumber}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                  );
                }}
              />
            </Grid>
          </>
        )}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        TransitionComponent={Transition}
        disableScrollLock
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete this event?"}
        </DialogTitle>
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
    </Container>
  );
};

export default DashboardPage;
