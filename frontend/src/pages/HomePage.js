import React from "react";
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
} from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PeopleIcon from "@mui/icons-material/People";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

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
  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: 8,
          mb: 6,
          width: "100%",
        }}
      >
        <Box sx={{ px: { xs: 2, sm: 4 }, maxWidth: "1600px", mx: "auto" }}>
          <Grid
            container
            spacing={4}
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Simplify Your Event Planning
              </Typography>
              <Typography variant="h5" sx={{ mb: 3, opacity: 0.9 }}>
                Create, manage, and discover events with EventZen. The
                all-in-one platform for event organizers and attendees.
              </Typography>
              <Stack direction="row" spacing={2}>
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
                src={`${process.env.PUBLIC_URL}/images/hero-event.svg`}
                alt="Event Planning"
                sx={{
                  width: "100%",
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
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ px: { xs: 2, sm: 4 }, maxWidth: "1600px", mx: "auto", mb: 8 }}>
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
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: "background.paper",
          py: 8,
          borderTop: 1,
          borderBottom: 1,
          borderColor: "divider",
          mb: 6,
          width: "100%",
        }}
      >
        <Box sx={{ px: { xs: 2, sm: 4 }, maxWidth: "1000px", mx: "auto" }}>
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
        </Box>
      </Box>

      {/* Featured Events */}
      <Box sx={{ px: { xs: 2, sm: 4 }, maxWidth: "1600px", mx: "auto", mb: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 4 }}
        >
          Featured Events
        </Typography>

        <Grid container spacing={4}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} md={4} key={item}>
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
                  image={`${process.env.PUBLIC_URL}/images/events/event-${item}.avif`}
                  alt={`Event ${item}`}
                  onError={(e) => {
                    console.log(
                      `Featured event-${item}.avif image load error, using default fallback`
                    );
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = `${process.env.PUBLIC_URL}/images/defaults/event-default.avif`;
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h3">
                    Sample Event {item}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    This is a placeholder for a featured event. Real events will
                    be displayed here.
                  </Typography>
                  <Button
                    component={RouterLink}
                    to={`/events/${item}`}
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
      </Box>
    </Box>
  );
};

export default HomePage;
