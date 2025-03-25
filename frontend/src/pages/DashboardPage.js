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
  Slide,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import { fetchEvents, deleteEvent, fetchUserEvents } from "../store/eventSlice";
import PageHeader from "../components/common/PageHeader";
import Loading from "../components/common/Loading";
import { getImageUrl, getFallbackImage } from "../utils/imageUtils";

// Custom transition component to prevent scrollTop errors
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
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

const DashboardPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { events, attendingEvents, loading } = useSelector(
    (state) => state.events
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchEvents({ userId: user?.id }));
    if (user?.id) {
      dispatch(fetchUserEvents(user.id));
    }
  }, [dispatch, user]);

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

  // Stats cards data
  const statsCards = [
    {
      title: "Your Events",
      value: events?.length || 0,
      icon: <EventIcon sx={{ fontSize: 40, color: "primary.main" }} />,
      color: "primary.light",
    },
    {
      title: "Attending",
      value: attendingEvents?.length || 0,
      icon: <PeopleIcon sx={{ fontSize: 40, color: "secondary.main" }} />,
      color: "secondary.light",
    },
  ];

  if (loading) {
    return <Loading message="Loading your dashboard..." />;
  }

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 2, sm: 4 },
        maxWidth: "1600px",
        mx: "auto",
        mt: 4,
        mb: 8,
      }}
    >
      <PageHeader
        title={`Welcome, ${user?.firstName || "User"}!`}
        subtitle="Manage your events and profile"
        actionText="Create Event"
        actionIcon={<AddIcon />}
        actionLink="/events/create"
      />

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                bgcolor: card.color,
                borderRadius: 2,
              }}
            >
              {card.icon}
              <Typography
                variant="h4"
                component="div"
                sx={{ mt: 2, fontWeight: "bold" }}
              >
                {card.value}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {card.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Your Events" />
          <Tab label="Attending" />
          <Tab label="Account" />
        </Tabs>

        {/* Your Events Tab */}
        <TabPanel value={tabValue} index={0}>
          {events && events.length > 0 ? (
            <List>
              {events.map((event, index) => (
                <React.Fragment key={event.id}>
                  <ListItem>
                    <ListItemText
                      primary={event.title}
                      secondary={`${formatDate(event.startDate)} | ${
                        event.location
                      }`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="view"
                        component={RouterLink}
                        to={`/events/${event.id}`}
                        sx={{ mr: 1 }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="edit"
                        component={RouterLink}
                        to={`/events/edit/${event.id}`}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < events.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                You haven't created any events yet
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/events/create"
                startIcon={<AddIcon />}
              >
                Create Your First Event
              </Button>
            </Box>
          )}
        </TabPanel>

        {/* Attending Tab */}
        <TabPanel value={tabValue} index={1}>
          {attendingEvents && attendingEvents.length > 0 ? (
            <Grid container spacing={4}>
              {attendingEvents.map((event) => (
                <Grid item xs={12} sm={6} md={4} key={event.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={`${process.env.PUBLIC_URL}/images/events/${event.image}`}
                      alt={event.title}
                      onError={(e) => {
                        console.log(
                          "Attending event image load error, using fallback"
                        );
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = `${process.env.PUBLIC_URL}/images/defaults/event-default.avif`;
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {event.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        <strong>Date:</strong> {formatDate(event.startDate)}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        <strong>Location:</strong> {event.location}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        <strong>Organizer:</strong> {event.organizer.name}
                      </Typography>
                      <Button
                        variant="outlined"
                        fullWidth
                        component={RouterLink}
                        to={`/events/${event.id}`}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                You're not attending any events yet
              </Typography>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/events"
              >
                Browse Events
              </Button>
            </Box>
          )}
        </TabPanel>

        {/* Account Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Profile Information
                  </Typography>
                  <Typography variant="body1">
                    <strong>Name:</strong> {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {user?.email}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mt: 2 }}
                    component={RouterLink}
                    to="/profile"
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Security Settings
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Manage your account security settings and password
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    component={RouterLink}
                    to="/profile"
                    sx={{ mt: 1 }}
                    onClick={() => {
                      // This will take the user to the Security tab on the profile page
                      localStorage.setItem("profileTabIndex", "1");
                    }}
                  >
                    Manage Security
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>

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
    </Box>
  );
};

export default DashboardPage;
