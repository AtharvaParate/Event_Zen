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
import { getFallbackImage } from "../../utils/imageUtils"; // Import the utility function

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
  // eslint-disable-next-line no-unused-vars
  const isEditMode = !!event;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use the image utility for the fallback image with specific preference for event-1.avif
  const fallbackImage = `${process.env.PUBLIC_URL}/images/event-1.avif`;

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
    startTime: formatDateForInput(new Date()),
    endTime: formatDateForInput(new Date(Date.now() + 3600000)), // Default 1 hour later
    location: "",
    category: "OTHER",
    maxAttendees: 50,
    price: 0,
    image: "",
    status: "DRAFT",
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
        startTime: formatDateForInput(event.startTime || event.startDate),
        endTime: formatDateForInput(event.endTime || event.endDate),
        location: event.location || "",
        category: event.category || "OTHER",
        maxAttendees: event.maxAttendees || event.capacity || 50,
        price: event.price || 0,
        image: event.image || "",
        status: event.status || "DRAFT",
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

    if (!formData.startTime) {
      errors.startTime = "Start time is required";
    }

    if (!formData.endTime) {
      errors.endTime = "End time is required";
    } else if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      errors.endTime = "End time must be after start time";
    }

    if (formData.maxAttendees <= 0) {
      errors.maxAttendees = "Maximum attendees must be greater than 0";
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
      // Format dates in ISO format
      const startTimeISO = new Date(formData.startTime).toISOString();
      const endTimeISO = new Date(formData.endTime).toISOString();

      // Create a clean copy of form data with correct types and exact field names
      const eventData = {
        title: formData.title,
        description: formData.description,
        startTime: startTimeISO,
        endTime: endTimeISO,
        location: formData.location,
        category: formData.category,
        maxAttendees: Number(formData.maxAttendees),
        price: Number(formData.price),
        status: formData.status || "DRAFT",
      };

      console.log("Submitting event data:", eventData);

      let result;

      // Try direct API call to avoid Redux complications
      try {
        if (isEditMode) {
          result = await eventApi.updateEvent(event.id, eventData);
        } else {
          result = await eventApi.createEvent(eventData);
        }

        console.log("Direct API call succeeded:", result);
      } catch (apiError) {
        console.error("Direct API call failed:", apiError);
        throw apiError; // Re-throw to be caught by outer catch
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
  // eslint-disable-next-line no-unused-vars

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
                        "Event preview image load error, using fallback in event/create"
                      );
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = fallbackImage;

                      // If the fallback also fails, try another file format or use data URI
                      e.target.onerror = () => {
                        console.log("Fallback image failed too, trying a different format");
                        // Try with another image in case the first one fails
                        e.target.src = `${process.env.PUBLIC_URL}/images/event-2.avif`;
                        
                        // Final fallback to data URI if all else fails
                        e.target.onerror = () => {
                          console.log("All fallbacks failed, using data URI");
                          e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20200%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_16ace7acfe3%20text%20%7B%20fill%3Argba(201%2C201%2C201%2C.5)%3Bfont-weight%3Anormal%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_16ace7acfe3%22%3E%3Crect%20width%3D%22288%22%20height%3D%22200%22%20fill%3D%22%23333%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.3515625%22%20y%3D%22106.1%22%3EEvent%20Image%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E";
                          e.target.onerror = null;
                        };
                      };
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
                  name="startTime"
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={handleChange}
                  error={!!formErrors.startTime}
                  helperText={formErrors.startTime}
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
                  name="endTime"
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={handleChange}
                  error={!!formErrors.endTime}
                  helperText={formErrors.endTime}
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
                  label="Max Attendees"
                  name="maxAttendees"
                  type="number"
                  value={formData.maxAttendees}
                  onChange={handleChange}
                  error={!!formErrors.maxAttendees}
                  helperText={formErrors.maxAttendees}
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
