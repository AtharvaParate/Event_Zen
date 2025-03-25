import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  InputAdornment,
  FormHelperText,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { createEvent, updateEvent } from "../../store/eventSlice";
import eventApi from "../../api/eventApi"; // Direct import of API for fallback
import {
  disableTransitions,
  safeMenuProps,
  safeSnackbarProps,
} from "../../utils/muiFixes"; // Import from centralized utilities

// Categories for dropdown
const categories = [
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

const EventForm = ({ event = null }) => {
  const isEditMode = !!event;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Default fallback image
  const fallbackImage = `${process.env.PUBLIC_URL}/images/defaults/event-default.jpg`;

  // Helper function to format date for input field
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    // Format: YYYY-MM-DDThh:mm
    return date.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: formatDateForInput(new Date()),
    endDate: formatDateForInput(new Date(Date.now() + 3600000)), // Default 1 hour later
    location: "",
    category: "OTHER",
    capacity: 50,
    price: 0,
    image: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: "info", // error, warning, info, success
  });

  // No need for local patches as we're now using the global one

  useEffect(() => {
    if (isEditMode && event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        startDate: formatDateForInput(event.startDate),
        endDate: formatDateForInput(event.endDate),
        location: event.location || "",
        category: event.category || "OTHER",
        capacity: event.capacity || 50,
        price: event.price || 0,
        image: event.image || "",
      });

      // Set image preview if exists
      if (event.image) {
        setImagePreview(
          `${process.env.PUBLIC_URL}/images/events/${event.image}`
        );
      }
    }
  }, [isEditMode, event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would handle file upload to server here
      // For the mock app, we'll just store the filename and create a preview
      const fileName = file.name;
      setFormData({
        ...formData,
        image: fileName,
      });

      // Create a preview URL (in a real app, this would be the uploaded file URL)
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }

    if (!formData.startDate) {
      errors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      errors.endDate = "End date is required";
    } else if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      errors.endDate = "End date must be after start date";
    }

    if (formData.capacity <= 0) {
      errors.capacity = "Capacity must be greater than 0";
    }

    if (formData.price < 0) {
      errors.price = "Price cannot be negative";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission

    // Show form validation errors if form is invalid
    if (!validateForm()) {
      setAlertState({
        open: true,
        message: "Please fix the form errors before submitting",
        severity: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a clean copy of form data with correct types
      const eventData = {
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        capacity: Number(formData.capacity),
        price: Number(formData.price),
      };

      console.log("Submitting event data:", eventData);

      let result;

      // Try direct API call if Redux approach fails
      try {
        if (isEditMode) {
          result = await dispatch(
            updateEvent({
              id: event.id,
              eventData,
            })
          ).unwrap();
        } else {
          result = await dispatch(createEvent(eventData)).unwrap();
        }
      } catch (reduxError) {
        console.warn(
          "Redux dispatch failed, trying direct API call:",
          reduxError
        );

        // Fallback to direct API call
        if (isEditMode) {
          result = await eventApi.updateEvent(event.id, eventData);
        } else {
          result = await eventApi.createEvent(eventData);
        }
      }

      console.log("Event saved successfully:", result);

      // Show success message
      setAlertState({
        open: true,
        message: isEditMode
          ? "Event updated successfully!"
          : "Event created successfully!",
        severity: "success",
      });

      // Navigate after success
      setTimeout(() => {
        if (result && result.id) {
          navigate(`/events/${result.id}`);
        } else {
          navigate("/events");
        }
      }, 1500);
    } catch (error) {
      console.error("Failed to save event:", error);

      // Show error message
      setAlertState({
        open: true,
        message: `Failed to ${isEditMode ? "update" : "create"} event: ${
          error.message || "Unknown error"
        }`,
        severity: "error",
      });

      setIsSubmitting(false);
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertState({ ...alertState, open: false });
  };

  return (
    <>
      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={undefined} // Disable transition completely
        {...safeSnackbarProps} // Apply safe snackbar props
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alertState.severity}
          variant="filled"
          sx={{ width: "100%", ...disableTransitions }}
        >
          {alertState.message}
        </Alert>
      </Snackbar>

      <Card
        sx={{
          width: "100%",
          maxWidth: "1600px",
          mx: "auto",
          boxShadow: 1,
          ...disableTransitions, // Apply global transition disabling
        }}
      >
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ overflow: "hidden" }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom>
                  {isEditMode ? "Edit Event" : "Create New Event"}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {isEditMode
                    ? "Update your event information below"
                    : "Fill in the details below to create a new event"}
                </Typography>
              </Grid>

              {/* Image Preview Section */}
              <Grid item xs={12}>
                <Card
                  sx={{
                    mb: 2,
                    maxWidth: 400,
                    mx: "auto",
                    boxShadow: 1,
                    ...disableTransitions, // Apply global transition disabling
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={imagePreview || fallbackImage}
                    alt="Event Preview"
                    onError={(e) => {
                      console.log(
                        "Event preview image load error, using fallback"
                      );
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = fallbackImage;
                    }}
                    sx={disableTransitions} // Apply global transition disabling
                  />
                  <CardContent>
                    <Typography variant="subtitle2" align="center">
                      Event Image Preview
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{ mt: 1, ...disableTransitions }}
                    >
                      {isEditMode ? "Change Image" : "Upload Image"}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageChange}
                      />
                    </Button>
                    <FormHelperText>
                      {formData.image
                        ? `Selected: ${formData.image}`
                        : "No image selected (a default image will be assigned)"}
                    </FormHelperText>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Event Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  error={!!formErrors.title}
                  helperText={formErrors.title}
                  required
                  sx={disableTransitions} // Apply global transition disabling
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={!!formErrors.description}
                  helperText={formErrors.description}
                  multiline
                  rows={4}
                  required
                  sx={disableTransitions} // Apply global transition disabling
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Start Date & Time"
                  name="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={handleChange}
                  error={!!formErrors.startDate}
                  helperText={formErrors.startDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  sx={disableTransitions} // Apply global transition disabling
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="End Date & Time"
                  name="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={handleChange}
                  error={!!formErrors.endDate}
                  helperText={formErrors.endDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                  sx={disableTransitions} // Apply global transition disabling
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  error={!!formErrors.location}
                  helperText={formErrors.location}
                  required
                  sx={disableTransitions} // Apply global transition disabling
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth sx={disableTransitions}>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    labelId="category-label"
                    name="category"
                    value={formData.category}
                    label="Category"
                    onChange={handleChange}
                    sx={disableTransitions} // Apply global transition disabling
                    MenuProps={safeMenuProps} // Use the centralized safe menu props
                  >
                    {categories.map((category) => (
                      <MenuItem
                        key={category.value}
                        value={category.value}
                        sx={disableTransitions}
                      >
                        {category.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  error={!!formErrors.capacity}
                  helperText={formErrors.capacity}
                  InputProps={{
                    inputProps: { min: 1 },
                  }}
                  sx={disableTransitions} // Apply global transition disabling
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  error={!!formErrors.price}
                  helperText={formErrors.price}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                    inputProps: { min: 0, step: 0.01 },
                  }}
                  sx={disableTransitions} // Apply global transition disabling
                />
              </Grid>

              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  sx={disableTransitions} // Apply global transition disabling
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    ...disableTransitions,
                    minWidth: "120px",
                  }}
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting && (
                      <CircularProgress size={20} color="inherit" />
                    )
                  }
                >
                  {isSubmitting
                    ? isEditMode
                      ? "Updating..."
                      : "Creating..."
                    : isEditMode
                    ? "Update Event"
                    : "Create Event"}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default EventForm;
