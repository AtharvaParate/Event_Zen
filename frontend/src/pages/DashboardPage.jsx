import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
} from "@mui/material";
import {
  Event as EventIcon,
  People as PeopleIcon,
  ConfirmationNumber as TicketIcon,
  TrendingUp as TrendingUpIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchEvents, deleteEvent } from "../store/eventSlice";
import { fetchAttendees } from "../api/attendeeApi";
import { fetchRegistrations } from "../api/registrationApi";
import Loading from "../components/common/Loading";
import PageHeader from "../components/common/PageHeader";

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
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    events,
    // eslint-disable-next-line no-unused-vars
    attendingEvents,
    loading: reduxLoading,
  } = useSelector((state) => state.events);

  // Local state
  const [attendees, setAttendees] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [loading, setLoading] = useState({
    attendees: false,
    registrations: false,
  });
  const [error, setError] = useState({
    events: null,
    attendees: null,
    registrations: null,
  });
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    // Initial data fetch
    dispatch(fetchEvents({ userId: user?.id }));
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, user]);

  // Refresh data when refresh counter changes
  useEffect(() => {
    if (refreshCounter > 0) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshCounter]);

  const loadData = async () => {
    // Load attendees
    try {
      setLoading((prev) => ({ ...prev, attendees: true }));
      const attendeesData = await fetchAttendees();
      setAttendees(attendeesData.content || []);
      setError((prev) => ({ ...prev, attendees: null }));
    } catch (err) {
      console.error("Error loading attendees:", err);
      setError((prev) => ({
        ...prev,
        attendees: "Failed to load attendees. Please try again.",
      }));

      // Provide mock data in development environment
      if (process.env.NODE_ENV === "development") {
        console.log("Using mock attendee data for development");
        setAttendees([
          {
            id: "mock-1",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phoneNumber: "123-456-7890",
            userId: "user-1",
            status: "REGISTERED",
            registrationIds: ["reg-1", "reg-2"],
          },
          {
            id: "mock-2",
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            phoneNumber: "987-654-3210",
            userId: "user-2",
            status: "CHECKED_IN",
            registrationIds: ["reg-3"],
          },
          {
            id: "mock-3",
            firstName: "Bob",
            lastName: "Johnson",
            email: "bob.johnson@example.com",
            phoneNumber: "555-123-4567",
            userId: "user-3",
            status: "CANCELLED",
            registrationIds: ["reg-4"],
          },
        ]);
      }
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
        registrations: "Failed to load registrations. Please try again.",
      }));

      // Provide mock data in development environment
      if (process.env.NODE_ENV === "development") {
        console.log("Using mock registration data for development");
        setRegistrations([
          {
            id: "reg-1",
            attendeeId: "mock-1",
            eventId: events.length > 0 ? events[0].id : "mock-event-1",
            confirmationNumber: "CNF123456",
            registrationDate: new Date().toISOString(),
            paymentStatus: "PAID",
            checkInStatus: "CHECKED_IN",
          },
          {
            id: "reg-2",
            attendeeId: "mock-2",
            eventId:
              events.length > 0
                ? events[1]?.id || events[0].id
                : "mock-event-2",
            confirmationNumber: "CNF789012",
            registrationDate: new Date().toISOString(),
            paymentStatus: "PENDING",
            checkInStatus: "NOT_CHECKED_IN",
          },
          {
            id: "reg-3",
            attendeeId: "mock-3",
            eventId:
              events.length > 0
                ? events[2]?.id || events[0].id
                : "mock-event-3",
            confirmationNumber: "CNF345678",
            registrationDate: new Date().toISOString(),
            paymentStatus: "REFUNDED",
            checkInStatus: "NOT_CHECKED_IN",
          },
        ]);
      }
    } finally {
      setLoading((prev) => ({ ...prev, registrations: false }));
    }
  };

  const handleRefresh = () => {
    setRefreshCounter((prev) => prev + 1);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // eslint-disable-next-line no-unused-vars
  const handleDeleteEvent = (eventId) => {
    setEventToDelete(eventId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteEvent(eventToDelete)).unwrap();
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    } catch (err) {
      console.error("Failed to delete event:", err);
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
    } catch (err) {
      return dateString;
    }
  };

  // Calculate statistics - add eslint-disable comments since these are calculated but not directly used
  // eslint-disable-next-line no-unused-vars
  const upcomingEvents = events.filter(
    (event) => new Date(event.startDate) > new Date()
  ).length;
  // eslint-disable-next-line no-unused-vars
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

  if (reduxLoading) {
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
            loading={reduxLoading}
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
                loading={reduxLoading}
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
                            {formatDate(event.startDate)} - {event.location}
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
                loading={reduxLoading}
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
                            {formatDate(event.endDate)} - {event.location}
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
                      primary={`${attendee.firstName || ""} ${
                        attendee.lastName || ""
                      }`}
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
                      primary={`${attendee.firstName || ""} ${
                        attendee.lastName || ""
                      }`}
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
                            ? `${attendee.firstName || ""} ${
                                attendee.lastName || ""
                              }`
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
                            ? `${attendee.firstName || ""} ${
                                attendee.lastName || ""
                              }`
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
