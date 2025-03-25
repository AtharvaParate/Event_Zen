import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import { fetchUserEvents } from "../redux/slices/eventSlice";
import PageHeader from "../components/common/PageHeader";
import Loading from "../components/common/Loading";

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
  const { events, loading } = useSelector((state) => state.events);

  // Mock data for attending events - in a real app, this would come from API
  const [attendingEvents] = useState([
    {
      id: "mock1",
      title: "Tech Conference 2025",
      date: "2025-06-15",
      location: "San Francisco, CA",
    },
    {
      id: "mock2",
      title: "Music Festival",
      date: "2025-07-20",
      location: "Austin, TX",
    },
  ]);

  useEffect(() => {
    dispatch(fetchUserEvents());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDeleteEvent = (eventId) => {
    // This would dispatch a delete event action
    console.log("Delete event:", eventId);
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
      value: attendingEvents.length,
      icon: <PeopleIcon sx={{ fontSize: 40, color: "secondary.main" }} />,
      color: "secondary.light",
    },
  ];

  if (loading) {
    return <Loading message="Loading your dashboard..." />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
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
                      secondary={`${new Date(
                        event.startDate
                      ).toLocaleDateString()} | ${event.location}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        component={RouterLink}
                        to={`/events/${event.id}`}
                        aria-label="view"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        component={RouterLink}
                        to={`/events/edit/${event.id}`}
                        aria-label="edit"
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
                  {index < events.length - 1 && <Divider />}
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
                startIcon={<AddIcon />}
                component={RouterLink}
                to="/events/create"
              >
                Create Your First Event
              </Button>
            </Box>
          )}
        </TabPanel>

        {/* Attending Tab */}
        <TabPanel value={tabValue} index={1}>
          {attendingEvents.length > 0 ? (
            <List>
              {attendingEvents.map((event, index) => (
                <React.Fragment key={event.id}>
                  <ListItem>
                    <ListItemText
                      primary={event.title}
                      secondary={`${new Date(
                        event.date
                      ).toLocaleDateString()} | ${event.location}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        component={RouterLink}
                        to={`/events/${event.id}`}
                        aria-label="view"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < attendingEvents.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
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
                    to="/profile/edit"
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
                    Account Settings
                  </Typography>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
                    component={RouterLink}
                    to="/profile/change-password"
                  >
                    Change Password
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    component={RouterLink}
                    to="/profile/delete-account"
                  >
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default DashboardPage;
