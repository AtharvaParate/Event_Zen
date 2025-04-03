import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PeopleIcon from "@mui/icons-material/People";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PageContainer from "../components/common/PageContainer";
import { fetchEvents } from "../api/eventApi";

const features = [
  {
    icon: <EventIcon sx={{ fontSize: 48 }} />,
    title: "Event Management",
    description:
      "Create and manage events with ease. Set up ticketing, track attendance, and more.",
  },
  {
    icon: <StorefrontIcon sx={{ fontSize: 48 }} />,
    title: "Vendor Directory",
    description:
      "Find and connect with vendors for your events. From catering to decor, we have you covered.",
  },
  {
    icon: <PeopleIcon sx={{ fontSize: 48 }} />,
    title: "Attendee Experience",
    description:
      "Give your attendees a seamless experience with digital tickets, reminders, and feedback options.",
  },
  {
    icon: <CalendarTodayIcon sx={{ fontSize: 48 }} />,
    title: "Event Discovery",
    description: "Browse and discover events happening in your area or niche.",
  },
];

const HomePage = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch featured events when component mounts
  useEffect(() => {
    const loadFeaturedEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch events from the API
        const eventsData = await fetchEvents(0, 3);
        
        // Use the content array if it exists, otherwise use the response directly
        const events = eventsData.content || eventsData || [];
        
        if (events.length > 0) {
          // Use real events if available
          setFeaturedEvents(events.slice(0, 3));
        } else {
          // No events returned
          setError("No events available. Please check back later.");
          setFeaturedEvents([]);
        }
      } catch (error) {
        console.error('Error fetching featured events:', error);
        setError("Failed to load events. Please try again later.");
        setFeaturedEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedEvents();
  }, []);

  // Helper function to get a consistent image index from event ID
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

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: { xs: 6, md: 8 },
          mb: 6,
          width: "100%",
        }}
      >
        <PageContainer
          sx={{
            py: 0,
            width: "100%",
          }}
        >
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
              <Typography variant="h2" component="h1" gutterBottom>
                Simplify Your Event Planning
              </Typography>
              <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
                Create, manage, and discover events with EventZen. The
                all-in-one platform for event organizers and attendees.
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  component={RouterLink}
                  to="/events/create"
                  variant="contained"
                  color="secondary"
                  size="large"
                >
                  Create Event
                </Button>
                <Button
                  component={RouterLink}
                  to="/events"
                  variant="outlined"
                  color="inherit"
                  size="large"
                >
                  Browse Events
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
              <Box
                component="img"
                src={`${process.env.PUBLIC_URL}/images/events/hero-image.avif`}
                alt="Event Planning"
                sx={{
                  width: "95%",
                  height: "auto",
                  maxHeight: "400px",
                  display: { xs: "none", md: "block" },
                }}
                onError={(e) => {
                  console.log("Hero image load error, using fallback");
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = `${process.env.PUBLIC_URL}/images/defaults/event-default.avif`;
                }}
              />
            </Grid>
          </Grid>
        </PageContainer>
      </Box>

      {/* Features Section */}
      <PageContainer sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Everything You Need for Successful Events
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 4,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    pt: 3,
                    color: "primary.main",
                  }}
                >
                  {feature.icon}
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h3"
                    align="center"
                  >
                    {feature.title}
                  </Typography>
                  <Typography align="center" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </PageContainer>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: "background.paper",
          py: { xs: 6, md: 8 },
          borderTop: 1,
          borderBottom: 1,
          borderColor: "divider",
          mb: 6,
          width: "100%",
        }}
      >
        <PageContainer
          sx={{
            py: 0,
            width: "100%",
          }}
        >
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Ready to Host Your Event?
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            paragraph
            sx={{ mb: 4 }}
          >
            Join thousands of event organizers who use EventZen to create
            memorable experiences.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              color="primary"
              size="large"
              sx={{ px: 4, py: 1 }}
            >
              Get Started Today
            </Button>
          </Box>
        </PageContainer>
      </Box>

      {/* Featured Events */}
      <PageContainer sx={{ mb: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Featured Events
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="info" sx={{ my: 4 }}>
            {error}
          </Alert>
        ) : featuredEvents.length === 0 ? (
          <Alert severity="info" sx={{ my: 4 }}>
            No events available at this time.
          </Alert>
        ) : (
          <Grid container spacing={4}>
            {featuredEvents.map((event) => (
              <Grid item xs={12} md={4} key={event.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${
                      process.env.PUBLIC_URL
                    }/images/events/event-${getImageIndex(event.id)}.avif`}
                    alt={event.title}
                    onError={(e) => {
                      console.log(
                        `Featured event image load error for event ${event.id}, using default fallback`
                      );
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = `${process.env.PUBLIC_URL}/images/defaults/event-default.avif`;
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h3">
                      {event.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {event.description?.substring(0, 120)}
                      {event.description?.length > 120 ? "..." : ""}
                    </Typography>
                    <Button
                      component={RouterLink}
                      to={`/events/${event.id}`}
                      size="small"
                      color="primary"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Button
            component={RouterLink}
            to="/events"
            variant="outlined"
            color="primary"
            size="large"
          >
            View All Events
          </Button>
        </Box>
      </PageContainer>
    </Box>
  );
};

export default HomePage;
