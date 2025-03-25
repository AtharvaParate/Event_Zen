import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from "@mui/material";
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  CalendarMonth as CalendarIcon,
  AttachMoney as PriceIcon,
} from "@mui/icons-material";
import PageHeader from "../components/common/PageHeader";
import Loading from "../components/common/Loading";
import { fetchEvents } from "../store/eventSlice";

const categories = [
  { value: "ALL", label: "All Categories" },
  { value: "BUSINESS", label: "Business" },
  { value: "TECHNOLOGY", label: "Technology" },
  { value: "HEALTH", label: "Health & Wellness" },
  { value: "MUSIC", label: "Music" },
  { value: "ARTS", label: "Arts & Culture" },
  { value: "FOOD", label: "Food & Drink" },
  { value: "SPORTS", label: "Sports & Fitness" },
  { value: "EDUCATION", label: "Education" },
  { value: "OTHER", label: "Other" },
];

const EventsPage = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.events);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [page, setPage] = useState(1);
  const eventsPerPage = 6;

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1); // Reset to first page on category change
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter events based on search term and category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchTerm === "" ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" || event.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Paginate events
  const indexOfLastEvent = page * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return <Loading message="Loading events..." />;
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
        title="Events"
        subtitle="Discover and browse upcoming events"
        breadcrumbs={[{ label: "Events" }]}
        action={true}
        actionText="Create Event"
        actionLink="/events/create"
      />

      {/* Search and Filter */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Search Events"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              value={selectedCategory}
              label="Category"
              onChange={handleCategoryChange}
            >
              {categories.map((category) => (
                <MenuItem key={category.value} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Search Results */}
      {filteredEvents.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No events found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search criteria or browse all events
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Showing {filteredEvents.length} events
          </Typography>

          <Grid container spacing={4}>
            {currentEvents.map((event) => (
              <Grid item xs={12} sm={6} lg={4} key={event.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition:
                      "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={`${process.env.PUBLIC_URL}/images/events/event-${
                      (event.id % 3) + 1
                    }.avif`}
                    alt={event.title}
                    onError={(e) => {
                      console.log(
                        `Image load error for event ${event.id}, using default fallback`
                      );
                      e.target.onerror = null; // Prevent infinite loop

                      // Direct fallback to default
                      e.target.src = `${process.env.PUBLIC_URL}/images/defaults/event-default.avif`;
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {event.title}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={event.category}
                        color="primary"
                        size="small"
                        sx={{ mr: 1, mb: 1 }}
                      />
                      {event.price === 0 ? (
                        <Chip
                          label="Free"
                          color="success"
                          size="small"
                          sx={{ mb: 1 }}
                        />
                      ) : null}
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <CalendarIcon
                        fontSize="small"
                        sx={{ mr: 1, color: "primary.main" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(event.startDate)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <LocationIcon
                        fontSize="small"
                        sx={{ mr: 1, color: "primary.main" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {event.location}
                      </Typography>
                    </Box>

                    {event.price > 0 && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <PriceIcon
                          fontSize="small"
                          sx={{ mr: 1, color: "primary.main" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          ${event.price.toFixed(2)}
                        </Typography>
                      </Box>
                    )}

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {event.description.substring(0, 120)}
                      {event.description.length > 120 ? "..." : ""}
                    </Typography>

                    <Button
                      component={RouterLink}
                      to={`/events/${event.id}`}
                      variant="contained"
                      fullWidth
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {filteredEvents.length > eventsPerPage && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <Pagination
                count={Math.ceil(filteredEvents.length / eventsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default EventsPage;
