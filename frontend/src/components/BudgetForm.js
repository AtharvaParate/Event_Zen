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

  // Enhanced submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission attempted", formData);

    if (!validateForm()) {
      console.log("Form validation failed", errors);
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API
      const budgetData = {
        ...formData,
        totalBudget: parseFloat(formData.totalBudget),
        categories: formData.categories || [], // Ensure categories is an array
      };

      // If editing, include the ID
      if (mode === "edit" && budget?.id) {
        budgetData.id = budget.id;
      }

      console.log("Sending budget data to API", budgetData);

      // Validate that event ID exists
      if (!budgetData.eventId) {
        throw new Error("Event ID is required");
      }

      await onSave(budgetData);
    } catch (err) {
      console.error("Error saving budget:", err);
      // Set specific error based on the error type
      const errorMessage =
        err.message === "Event ID is required"
          ? "Please select an event"
          : "Failed to save the budget. Please try again.";

      setErrors((prev) => ({
        ...prev,
        eventId:
          err.message === "Event ID is required"
            ? "Please select an event"
            : prev.eventId,
        form: errorMessage,
      }));

      // Show alert dialog
      alert("Error saving budget: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {errors.form && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.form}
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
            disabled={loading}
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
              disabled={loading || loadingEvents}
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
            <Button variant="outlined" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              {loading
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
