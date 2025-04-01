import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  Paper,
  InputAdornment,
  Alert,
  CircularProgress,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import { fetchEvents } from "../api/eventApi";

// Common budget categories
const BUDGET_CATEGORIES = [
  "Venue",
  "Catering",
  "Marketing",
  "Staff",
  "Equipment",
  "Entertainment",
  "Decor",
  "Photography",
  "Transportation",
  "Accommodation",
  "Printing",
  "Gifts",
  "Insurance",
  "Technology",
  "Security",
  "Miscellaneous",
];

const BudgetForm = ({ budget = null, onSave, onCancel, mode = "create" }) => {
  const [formData, setFormData] = useState({
    name: "",
    eventId: "",
    totalBudget: "",
    notes: "",
    categories: [],
    status: "ACTIVE",
  });

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [errors, setErrors] = useState({});
  const [customCategory, setCustomCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Load event data for dropdown
  useEffect(() => {
    const loadEvents = async () => {
      setLoadingEvents(true);
      try {
        console.log("Fetching events for dropdown");
        const response = await fetchEvents();
        console.log("Events fetched:", response);

        // Make sure we handle both array and paginated response formats
        const eventsList = Array.isArray(response)
          ? response
          : response.content || [];

        console.log("Events list to be used:", eventsList);
        setEvents(eventsList);
      } catch (err) {
        console.error("Failed to load events:", err);
        // Set an empty array to avoid undefined errors
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    loadEvents();
  }, []);

  // Initialize form with budget data if editing
  useEffect(() => {
    if (budget && mode === "edit") {
      setFormData({
        name: budget.name || "",
        eventId: budget.eventId || "",
        totalBudget: budget.totalBudget?.toString() || "",
        notes: budget.notes || "",
        categories: budget.categories || [],
        status: budget.status || "ACTIVE",
      });
    }
  }, [budget, mode]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field '${name}' changed to:`, value);

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error when user corrects the field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Handle categories changes
  const handleCategoriesChange = (_, newValue) => {
    console.log("Categories changed to:", newValue);
    setFormData((prev) => ({
      ...prev,
      categories: newValue || [],
    }));

    // Clear the categories error when categories are selected
    if (errors.categories && newValue && newValue.length > 0) {
      setErrors((prev) => ({
        ...prev,
        categories: null,
      }));
    }
  };

  // Add custom category
  const handleAddCustomCategory = () => {
    if (customCategory && !formData.categories.includes(customCategory)) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, customCategory],
      }));
      setCustomCategory("");
    }
  };

  // Remove category
  const handleRemoveCategory = (category) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }));
  };

  // Enhanced validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Budget name is required";
    }

    if (!formData.eventId || formData.eventId === "") {
      newErrors.eventId = "Please select an event";
    }

    if (!formData.totalBudget || formData.totalBudget === "") {
      newErrors.totalBudget = "Total budget amount is required";
    } else if (
      isNaN(parseFloat(formData.totalBudget)) ||
      parseFloat(formData.totalBudget) <= 0
    ) {
      newErrors.totalBudget = "Please enter a valid positive number";
    }

    if (!formData.categories || formData.categories.length === 0) {
      newErrors.categories = "Please select at least one category";
    }

    console.log("Validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validate the form
      const validationErrors = validateForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }

      console.log(`Submitting budget data in ${mode} mode:`, formData);

      // Format data for API
      const budgetData = {
        ...formData,
        totalBudget: parseFloat(formData.totalBudget),
        currentExpenses: formData.currentExpenses
          ? parseFloat(formData.currentExpenses)
          : 0,
        currentIncome: formData.currentIncome
          ? parseFloat(formData.currentIncome)
          : 0,
        eventId: parseInt(formData.eventId, 10),
      };

      let result;
      try {
        // Call the appropriate API based on mode
        if (mode === "create") {
          setIsLoading(true); // Show loading state when creating
          try {
            result = await onSave(budgetData);
            console.log("Budget created successfully:", result);

            // Show success message
            setIsLoading(false);
            setAlertState({
              open: true,
              message: "Budget created successfully!",
              severity: "success",
            });

            // Delay closing the form to allow the user to see the success message
            setTimeout(() => {
              onCancel();
            }, 1500);
          } catch (createError) {
            setIsLoading(false);
            console.error("Error creating budget:", createError);
            handleApiError(createError);
          }
        } else {
          setIsLoading(true); // Show loading state when updating
          try {
            result = await onSave(budgetData);
            console.log(`Budget ${budget?.id} updated successfully:`, result);

            // Show success message
            setIsLoading(false);
            setAlertState({
              open: true,
              message: `Budget ${budget?.id} updated successfully!`,
              severity: "success",
            });

            // Delay closing the form to allow the user to see the success message
            setTimeout(() => {
              onCancel();
            }, 1500);
          } catch (updateError) {
            setIsLoading(false);
            console.error("Error updating budget:", updateError);
            handleApiError(updateError);
          }
        }
      } catch (apiError) {
        console.error("API error:", apiError);
        handleApiError(apiError);
      }
    } catch (error) {
      console.error("Unexpected error during form submission:", error);
      setErrors({
        form: `An unexpected error occurred: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to handle API errors
  const handleApiError = (apiError) => {
    // Check for specific API error responses
    if (apiError.response) {
      if (apiError.response.status === 400) {
        // Bad request - likely validation errors
        setErrors({
          form: `Validation error: ${
            apiError.response.data.message || "Please check your inputs"
          }`,
        });
      } else if (apiError.response.status === 404) {
        // Not found error
        setErrors({
          form: "The requested resource was not found. Please refresh and try again.",
        });
      } else if (apiError.response.status === 500) {
        // Server error
        setErrors({
          form: "Server error occurred. Please try again later or contact support.",
        });
      } else {
        // Other API errors
        setErrors({
          form: `Error: ${
            apiError.response.data.message ||
            apiError.message ||
            "Unknown error"
          }`,
        });
      }
    } else if (apiError.request) {
      // Network error - no response received
      setErrors({
        form: "Network error. Please check your connection and try again.",
      });

      // Show more specific error for timeouts
      if (apiError.message && apiError.message.includes("timeout")) {
        setErrors({
          form: "Request timed out. The server might be busy. Please try again in a moment.",
        });
      }
    } else {
      // Other errors
      setErrors({
        form: `Error: ${apiError.message || "Unknown error occurred"}`,
      });
    }

    // Show error in the alert
    setAlertState({
      open: true,
      message: errors.form || "An error occurred while processing your request",
      severity: "error",
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {errors.form && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.form}
        </Alert>
      )}

      {/* Display success or error alerts */}
      {alertState.open && (
        <Alert
          severity={alertState.severity}
          sx={{ mb: 2 }}
          onClose={() => setAlertState({ ...alertState, open: false })}
        >
          {alertState.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Budget Name */}
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Budget Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            disabled={loading || isLoading}
          />
        </Grid>

        {/* Event Selection */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.eventId} required>
            <InputLabel>Associated Event</InputLabel>
            <Select
              name="eventId"
              value={formData.eventId || ""}
              onChange={handleChange}
              disabled={loading || loadingEvents || isLoading}
            >
              {loadingEvents ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Loading events...
                </MenuItem>
              ) : events.length > 0 ? (
                events.map((event) => (
                  <MenuItem key={event.id} value={event.id}>
                    {event.name || event.title || `Event ${event.id}`}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No events available</MenuItem>
              )}
            </Select>
            {errors.eventId && (
              <FormHelperText>{errors.eventId}</FormHelperText>
            )}
            <FormHelperText>
              {events.length > 0
                ? `${events.length} events available`
                : "No events found"}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/* Budget Amount */}
        <Grid item xs={12} md={6}>
          <TextField
            required
            fullWidth
            label="Total Budget Amount"
            name="totalBudget"
            type="number"
            value={formData.totalBudget}
            onChange={handleChange}
            error={!!errors.totalBudget}
            helperText={errors.totalBudget}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">$</InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Status */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Budget Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={loading}
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="DRAFT">Draft</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="ARCHIVED">Archived</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Categories */}
        <Grid item xs={12} md={6}>
          <Autocomplete
            multiple
            freeSolo
            options={BUDGET_CATEGORIES.filter(
              (c) => !formData.categories.includes(c)
            )}
            value={formData.categories || []}
            onChange={handleCategoriesChange}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Budget Categories"
                placeholder="Select categories"
                error={!!errors.categories}
                helperText={errors.categories}
                required
              />
            )}
            disabled={loading}
          />
        </Grid>

        {/* Custom Category */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
            <TextField
              fullWidth
              label="Add Custom Category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter custom category"
              disabled={loading}
            />
            <Button
              variant="outlined"
              onClick={handleAddCustomCategory}
              disabled={!customCategory || loading}
              sx={{ height: "56px", whiteSpace: "nowrap" }}
            >
              Add
            </Button>
          </Box>
        </Grid>

        {/* Selected Categories */}
        {formData.categories.length > 0 && (
          <Grid item xs={12}>
            <Paper
              variant="outlined"
              sx={{ p: 2, background: "rgba(0, 0, 0, 0.02)" }}
            >
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Selected Categories:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {formData.categories.map((category) => (
                  <Chip
                    key={category}
                    label={category}
                    onDelete={() => handleRemoveCategory(category)}
                    disabled={loading}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Notes */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            multiline
            rows={4}
            placeholder="Enter any notes about this budget"
            disabled={loading}
          />
        </Grid>

        {/* Form Buttons */}
        <Grid item xs={12}>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
          >
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading || isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || isLoading}
              startIcon={isLoading && <CircularProgress size={20} />}
            >
              {isLoading
                ? "Saving..."
                : mode === "edit"
                ? "Update Budget"
                : "Create Budget"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BudgetForm;
