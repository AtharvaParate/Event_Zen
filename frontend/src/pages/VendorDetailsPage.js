import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Rating,
  Tabs,
  Tab,
  Avatar,
  TextField,
  Paper,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as LanguageIcon,
  CheckCircle as CheckCircleIcon,
  Event as EventIcon,
  Star as StarIcon,
} from "@mui/icons-material";

// Mock vendor data (would come from an API in a real application)
const vendors = [
  {
    id: 1,
    name: "Party Planners Deluxe",
    category: "Event Planning",
    location: "New York, NY",
    rating: 4.8,
    description:
      "Premier event planning service with 10+ years experience in corporate and private events. We specialize in creating memorable experiences tailored to your specific needs and budget. From concept to execution, our team of professional planners will guide you through every step of the process.",
    phone: "(212) 555-1234",
    email: "info@partyplannersdeluxe.com",
    website: "www.partyplannersdeluxe.com",
    services: [
      "Event strategy and concept development",
      "Venue selection and booking",
      "Vendor coordination",
      "Budget management",
      "Day-of coordination",
      "Post-event evaluation",
    ],
    image: "vendor-1.jpg",
    recentEvents: [
      {
        id: "evt-101",
        title: "Tech Conference 2024",
        date: "2024-03-15",
        location: "Javits Center, New York",
        image: "event-1.jpg",
      },
      {
        id: "evt-102",
        title: "Corporate Holiday Party",
        date: "2023-12-18",
        location: "The Plaza Hotel, New York",
        image: "event-2.jpg",
      },
    ],
  },
  {
    id: 2,
    name: "Gourmet Catering Co.",
    category: "Catering",
    location: "Los Angeles, CA",
    rating: 4.6,
    description:
      "Fine dining catering service specializing in international cuisine for events of all sizes. Our team of award-winning chefs create custom menus that blend culinary excellence with artistic presentation. We source the freshest local ingredients and can accommodate all dietary requirements.",
    phone: "(310) 555-2345",
    email: "bookings@gourmetcateringco.com",
    website: "www.gourmetcateringco.com",
    services: [
      "Custom menu creation",
      "Food and beverage service",
      "Staffing (servers, bartenders)",
      "Equipment rentals",
      "Wine and cocktail pairing",
      "Dessert stations",
    ],
    image: "vendor-2.jpg",
    recentEvents: [
      {
        id: "evt-201",
        title: "Celebrity Wedding Reception",
        date: "2024-02-14",
        location: "Malibu Beach, CA",
        image: "event-3.jpg",
      },
      {
        id: "evt-202",
        title: "Film Industry Awards Gala",
        date: "2024-01-20",
        location: "Beverly Hills Hotel, CA",
        image: "event-4.jpg",
      },
    ],
  },
  {
    id: 3,
    name: "Sound & Lighting Pros",
    category: "Audio/Visual",
    location: "Chicago, IL",
    rating: 4.7,
    description:
      "Complete audio and visual solutions for concerts, conferences, and special events. Our experienced technicians utilize state-of-the-art equipment to create perfect sound quality and stunning lighting designs. We handle everything from basic microphone setups to elaborate stage productions.",
    phone: "(312) 555-3456",
    email: "tech@soundlightingpros.com",
    website: "www.soundlightingpros.com",
    services: [
      "Professional sound systems",
      "Stage and architectural lighting",
      "LED video walls and projection",
      "Live streaming services",
      "DJ equipment rental",
      "On-site technical support",
    ],
    image: "vendor-3.jpg",
    recentEvents: [
      {
        id: "evt-301",
        title: "Music Festival 2024",
        date: "2024-07-10",
        location: "Grant Park, Chicago",
        image: "event-1.jpg",
      },
      {
        id: "evt-302",
        title: "Technology Summit",
        date: "2024-04-05",
        location: "McCormick Place, Chicago",
        image: "event-2.jpg",
      },
    ],
  },
  {
    id: 4,
    name: "Blooms & Bouquets",
    category: "Floral Design",
    location: "Miami, FL",
    rating: 4.9,
    description:
      "Award-winning floral design studio creating stunning arrangements for weddings and corporate events. Our talented designers blend artistic vision with botanical expertise to transform spaces with breathtaking displays. We work with seasonal flowers and sustainably sourced materials.",
    phone: "(305) 555-4567",
    email: "designs@bloomsandbouquets.com",
    website: "www.bloomsandbouquets.com",
    services: [
      "Custom floral arrangements",
      "Event space decoration",
      "Wedding bouquets and boutonnieres",
      "Table centerpieces",
      "Ceremonial arches and installations",
      "Sustainable and eco-friendly options",
    ],
    image: "vendor-4.jpg",
    recentEvents: [
      {
        id: "evt-401",
        title: "Luxury Beach Wedding",
        date: "2024-06-20",
        location: "South Beach, Miami",
        image: "event-3.jpg",
      },
      {
        id: "evt-402",
        title: "Spring Fashion Showcase",
        date: "2024-04-15",
        location: "Design District, Miami",
        image: "event-4.jpg",
      },
    ],
  },
];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vendor-tabpanel-${index}`}
      aria-labelledby={`vendor-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const VendorDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [messageData, setMessageData] = useState({
    name: "",
    email: "",
    eventDate: "",
    message: "",
  });

  // Convert string ID to number for comparison
  const numericId = parseInt(id, 10);

  // Find the vendor by ID
  const vendor = vendors.find((v) => v.id === numericId);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMessageChange = (e) => {
    const { name, value } = e.target;
    setMessageData({
      ...messageData,
      [name]: value,
    });
  };

  const handleSubmitMessage = (e) => {
    e.preventDefault();
    console.log("Message submitted:", messageData);
    // In a real app, this would send the message to the backend
    alert(
      "Your message has been sent to the vendor. They will contact you soon!"
    );
    setMessageData({
      name: "",
      email: "",
      eventDate: "",
      message: "",
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  if (!vendor) {
    return (
      <Box
        sx={{
          width: "100%",
          p: 3,
          maxWidth: "1200px",
          mx: "auto",
          mt: 4,
          mb: 8,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Vendor Not Found
        </Typography>
        <Typography variant="body1" paragraph>
          The vendor you're looking for doesn't exist or has been removed.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/vendors")}
          sx={{ mt: 2 }}
        >
          Back to Vendors
        </Button>
      </Box>
    );
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
      {/* Header with back button */}
      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <IconButton
          color="primary"
          onClick={() => navigate("/vendors")}
          sx={{ mr: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" component="h1">
            {vendor.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            <Chip
              label={vendor.category}
              color="primary"
              size="small"
              sx={{ mr: 2, mt: 0.5 }}
            />
            <Rating
              value={vendor.rating}
              precision={0.1}
              readOnly
              size="small"
              sx={{ mr: 1, mt: 0.5 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              ({vendor.rating})
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main content */}
      <Grid container spacing={4}>
        {/* Left column - Vendor info */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 4 }}>
            <CardMedia
              component="img"
              height="300"
              image={`${process.env.PUBLIC_URL}/images/vendors/${vendor.image}`}
              alt={vendor.name}
            />
            <CardContent>
              <Typography variant="h5" gutterBottom>
                About {vendor.name}
              </Typography>
              <Typography variant="body1" paragraph>
                {vendor.description}
              </Typography>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOnIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">{vendor.location}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <PhoneIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">{vendor.phone}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <EmailIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">{vendor.email}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LanguageIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="body1">{vendor.website}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Tabs section */}
          <Paper sx={{ mb: 4 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab icon={<CheckCircleIcon />} label="Services" />
              <Tab icon={<EventIcon />} label="Recent Events" />
              <Tab icon={<StarIcon />} label="Reviews" />
            </Tabs>

            {/* Services Tab */}
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom>
                Services Offered
              </Typography>
              <List>
                {vendor.services.map((service, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText primary={service} />
                    </ListItem>
                    {index < vendor.services.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </TabPanel>

            {/* Recent Events Tab */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Recent Events
              </Typography>
              <Grid container spacing={3}>
                {vendor.recentEvents.map((event) => (
                  <Grid item xs={12} sm={6} key={event.id}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="160"
                        image={`${process.env.PUBLIC_URL}/images/events/${event.image}`}
                        alt={event.title}
                      />
                      <CardContent>
                        <Typography variant="h6">{event.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(event.date)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {event.location}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>

            {/* Reviews Tab (mock data) */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Customer Reviews
              </Typography>
              <List>
                {[1, 2, 3].map((item) => (
                  <React.Fragment key={item}>
                    <ListItem alignItems="flex-start">
                      <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                        {String.fromCharCode(64 + item)}
                      </Avatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography variant="subtitle1" component="span">
                              {["John D.", "Sarah M.", "Michael T."][item - 1]}
                            </Typography>
                            <Rating
                              value={5 - (item % 2)}
                              readOnly
                              size="small"
                              sx={{ ml: 1 }}
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              {formatDate(`2024-0${item}-15`)}
                            </Typography>
                            <Typography variant="body2" paragraph>
                              {
                                [
                                  "Absolutely amazing service! They went above and beyond to make our event perfect.",
                                  "Very professional and responsive. Great attention to detail.",
                                  "Exceeded our expectations in every way. Would definitely hire again!",
                                ][item - 1]
                              }
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </TabPanel>
          </Paper>
        </Grid>

        {/* Right column - Contact form */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: "sticky", top: 20 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Contact {vendor.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Interested in working with this vendor? Send them a message to
                get started.
              </Typography>

              <form onSubmit={handleSubmitMessage}>
                <TextField
                  label="Your Name"
                  name="name"
                  value={messageData.name}
                  onChange={handleMessageChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Your Email"
                  name="email"
                  type="email"
                  value={messageData.email}
                  onChange={handleMessageChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Event Date"
                  name="eventDate"
                  type="date"
                  value={messageData.eventDate}
                  onChange={handleMessageChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Your Message"
                  name="message"
                  value={messageData.message}
                  onChange={handleMessageChange}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VendorDetailsPage;
