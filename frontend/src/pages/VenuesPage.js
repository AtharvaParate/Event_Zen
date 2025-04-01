import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Paper,
  Pagination,
  CircularProgress,
  Snackbar,
  Alert,
  FormControlLabel,
  Switch,
  Tooltip,
  Skeleton,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Event as EventIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
  Check as CheckIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import {
  fetchVenues,
  createVenue,
  updateVenue,
  deleteVenue,
  searchVenues,
} from "../api/venueApi";

const VenuesPage = () => {
  const navigate = useNavigate();

  // State variables
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(6);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("create"); // "create" or "edit"
  const [currentVenue, setCurrentVenue] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Filters
  const [capacityFilter, setCapacityFilter] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Load venues on component mount and when page changes
  useEffect(() => {
    loadVenues();
  }, [page, pageSize]);

  // Function to load venues
  const loadVenues = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchVenues(page, pageSize);

      // Handle paginated response
      if (data.content) {
        setVenues(data.content);
        setTotalPages(data.totalPages);
      } else {
        // Handle non-paginated response
        setVenues(data);
        setTotalPages(Math.ceil(data.length / pageSize));
      }
    } catch (err) {
      console.error("Error loading venues:", err);
      setError("Failed to load venues. Please try again.");
      showMessage("Failed to load venues", "error");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle search
  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare filters
      const filters = {};
      if (capacityFilter) filters.minCapacity = capacityFilter;
      if (availabilityFilter !== "all")
        filters.availability =
          availabilityFilter === "available" ? "true" : "false";

      const results = await searchVenues(searchTerm, filters);

      if (Array.isArray(results)) {
        setVenues(results);
        setTotalPages(Math.ceil(results.length / pageSize));
      } else if (results.content) {
        setVenues(results.content);
        setTotalPages(results.totalPages);
      } else {
        setVenues([]);
        setTotalPages(0);
      }
    } catch (err) {
      console.error("Error searching venues:", err);
      setError("Failed to search venues. Please try again.");
      showMessage("Search failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle page change
  const handlePageChange = (event, value) => {
    setPage(value - 1); // API is 0-indexed, but Pagination is 1-indexed
  };

  // Function to open create dialog
  const handleOpenCreateDialog = () => {
    setDialogMode("create");
    setCurrentVenue({
      name: "",
      location: "",
      capacity: 0,
      pricePerHour: 0,
      description: "",
      amenities: [],
      availability: true,
    });
    setOpenDialog(true);
  };

  // Function to open edit dialog
  const handleOpenEditDialog = (venue) => {
    setDialogMode("edit");
    setCurrentVenue({ ...venue });
    setOpenDialog(true);
  };

  // Function to handle dialog close
  const handleCloseDialog = () => {
    if (!formSubmitting) {
      setOpenDialog(false);
      setTimeout(() => setCurrentVenue(null), 300); // Clear after animation completes
    }
  };

  // Function to handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "capacity" || name === "pricePerHour") {
      // Convert to number for numeric fields
      setCurrentVenue((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else if (name === "amenities") {
      // Handle amenities as array
      setCurrentVenue((prev) => ({
        ...prev,
        amenities: value
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item !== ""),
      }));
    } else if (name === "availability") {
      // Handle boolean
      setCurrentVenue((prev) => ({
        ...prev,
        availability: value === "true",
      }));
    } else {
      // Handle strings
      setCurrentVenue((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      if (dialogMode === "create") {
        // Create new venue
        const newVenue = await createVenue(currentVenue);
        showMessage("Venue created successfully", "success");

        // Add to venues list if on first page
        if (page === 0) {
          setVenues((prev) => [newVenue, ...prev].slice(0, pageSize));
        }
      } else {
        // Update existing venue
        const updatedVenue = await updateVenue(currentVenue.id, currentVenue);
        showMessage("Venue updated successfully", "success");

        // Update venues list
        setVenues((prev) =>
          prev.map((v) => (v.id === updatedVenue.id ? updatedVenue : v))
        );
      }

      // Close dialog
      setOpenDialog(false);
      setTimeout(() => setCurrentVenue(null), 300);
    } catch (err) {
      console.error("Error submitting form:", err);
      showMessage("Failed to save venue. Please try again.", "error");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Function to handle venue deletion
  const handleDeleteVenue = async (id, name) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${name}"? This action cannot be undone.`
      )
    ) {
      setLoading(true);

      try {
        await deleteVenue(id);
        showMessage("Venue deleted successfully", "success");

        // Remove from venues list
        setVenues((prev) => prev.filter((v) => v.id !== id));
      } catch (err) {
        console.error("Error deleting venue:", err);
        showMessage("Failed to delete venue. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  // Function to show venue details
  const handleViewVenueDetails = (id) => {
    navigate(`/venues/${id}`);
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

  // Render venue cards
  const renderVenueCards = () => {
    if (loading && venues.length === 0) {
      // Show skeleton loading state
      return Array.from(new Array(6)).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
          <Card
            sx={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Skeleton variant="rectangular" height={140} />
            <CardContent sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" height={32} width="80%" />
              <Skeleton variant="text" height={20} width="60%" />
              <Box sx={{ mt: 2 }}>
                <Skeleton variant="text" height={20} width="90%" />
                <Skeleton variant="text" height={20} width="70%" />
              </Box>
            </CardContent>
            <CardActions>
              <Skeleton
                variant="rectangular"
                height={36}
                width={80}
                sx={{ mr: 1 }}
              />
              <Skeleton variant="rectangular" height={36} width={80} />
            </CardActions>
          </Card>
        </Grid>
      ));
    }

    if (venues.length === 0 && !loading) {
      return (
        <Grid item xs={12}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" color="textSecondary">
              No venues found
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {searchTerm || capacityFilter || availabilityFilter !== "all"
                ? "Try adjusting your search criteria"
                : "Click the 'Add Venue' button to create your first venue"}
            </Typography>
          </Paper>
        </Grid>
      );
    }

    return venues.map((venue) => (
      <Grid item xs={12} sm={6} md={4} key={venue.id}>
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: 6,
            },
          }}
        >
          <CardMedia
            component="img"
            height="140"
            image={
              venue.images?.[0] ||
              "https://source.unsplash.com/random/800x600/?venue"
            }
            alt={venue.name}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h5" component="h2">
              {venue.name}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <LocationIcon
                fontSize="small"
                sx={{ mr: 0.5, color: "text.secondary" }}
              />
              <Typography variant="body2" color="text.secondary">
                {venue.location}
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <PeopleIcon
                  fontSize="small"
                  sx={{ mr: 0.5, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  {venue.capacity} guests
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <MoneyIcon
                  fontSize="small"
                  sx={{ mr: 0.5, color: "text.secondary" }}
                />
                <Typography variant="body2" color="text.secondary">
                  ${venue.pricePerHour}/hr
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
              }}
            >
              {venue.description}
            </Typography>

            <Box sx={{ mt: 1 }}>
              <Chip
                label={venue.availability ? "Available" : "Unavailable"}
                color={venue.availability ? "success" : "error"}
                size="small"
              />
            </Box>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              onClick={() => handleViewVenueDetails(venue.id)}
            >
              View Details
            </Button>
            <Button size="small" onClick={() => handleOpenEditDialog(venue)}>
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => handleDeleteVenue(venue.id, venue.name)}
            >
              Delete
            </Button>
          </CardActions>
        </Card>
      </Grid>
    ));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Venue Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          Add Venue
        </Button>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Search Venues"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSearch} edge="end">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Min Capacity"
              variant="outlined"
              type="number"
              value={capacityFilter}
              onChange={(e) => setCapacityFilter(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <PeopleIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="availability-filter-label">
                Availability
              </InputLabel>
              <Select
                labelId="availability-filter-label"
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                label="Availability"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="available">Available Only</MenuItem>
                <MenuItem value="unavailable">Unavailable Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
              >
                Search
              </Button>
              <Tooltip title="Reset Filters">
                <IconButton
                  onClick={() => {
                    setSearchTerm("");
                    setCapacityFilter("");
                    setAvailabilityFilter("all");
                    loadVenues();
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Venue cards */}
      <Grid container spacing={3}>
        {renderVenueCards()}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Loading indicator */}
      {loading && venues.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Create/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === "create" ? "Add New Venue" : "Edit Venue"}
        </DialogTitle>

        <DialogContent dividers>
          {currentVenue && (
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Venue Name"
                    name="name"
                    value={currentVenue.name}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Location"
                    name="location"
                    value={currentVenue.location}
                    onChange={handleInputChange}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Capacity"
                    name="capacity"
                    type="number"
                    value={currentVenue.capacity}
                    onChange={handleInputChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">guests</InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Price Per Hour"
                    name="pricePerHour"
                    type="number"
                    value={currentVenue.pricePerHour}
                    onChange={handleInputChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={currentVenue.description}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Amenities (comma separated)"
                    name="amenities"
                    value={
                      currentVenue.amenities
                        ? currentVenue.amenities.join(", ")
                        : ""
                    }
                    onChange={handleInputChange}
                    helperText="E.g. WiFi, Catering, Sound System, Projector"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="availability-label">
                      Availability
                    </InputLabel>
                    <Select
                      labelId="availability-label"
                      name="availability"
                      value={currentVenue.availability?.toString() || "true"}
                      onChange={handleInputChange}
                      label="Availability"
                    >
                      <MenuItem value="true">Available</MenuItem>
                      <MenuItem value="false">Unavailable</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={formSubmitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={formSubmitting}
          >
            {formSubmitting ? (
              <CircularProgress size={24} />
            ) : dialogMode === "create" ? (
              "Create"
            ) : (
              "Update"
            )}
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

export default VenuesPage;
