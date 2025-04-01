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
  InputAdornment,
  CircularProgress,
  FormHelperText,
  Alert,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { format, parse } from "date-fns";

// Common income categories
const INCOME_CATEGORIES = [
  "Ticket Sales",
  "Sponsorship",
  "Donations",
  "Merchandise",
  "Food and Beverage",
  "Advertising",
  "Vendor Fees",
  "Workshop Fees",
  "Grants",
  "Investments",
  "Refunds",
  "Other",
];

// Income status options
const INCOME_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "RECEIVED", label: "Received" },
  { value: "CANCELLED", label: "Cancelled" },
];

const IncomeForm = ({
  income,
  onSave,
  onCancel,
  budgetId,
  categories = [],
}) => {
  const [formData, setFormData] = useState({
    budgetId: budgetId || "",
    category: "",
    amount: "",
    description: "",
    source: "",
    date: new Date(),
    status: "PENDING",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form with income data if editing
  useEffect(() => {
    if (income) {
      setFormData({
        budgetId: income.budgetId || budgetId || "",
        category: income.category || "",
        amount: income.amount?.toString() || "",
        description: income.description || "",
        source: income.source || "",
        date: income.date ? new Date(income.date) : new Date(),
        status: income.status || "PENDING",
      });
    }
  }, [income, budgetId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
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

  // Handle date change
  const handleDateChange = (newDate) => {
    setFormData((prev) => ({
      ...prev,
      date: newDate,
    }));
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (
      isNaN(parseFloat(formData.amount)) ||
      parseFloat(formData.amount) <= 0
    ) {
      newErrors.amount = "Please enter a valid positive amount";
    }

    if (!formData.source.trim()) {
      newErrors.source = "Source is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API
      const incomeData = {
        ...formData,
        amount: parseFloat(formData.amount),
        budgetId: budgetId || formData.budgetId,
      };

      // If editing, include the ID
      if (income?.id) {
        incomeData.id = income.id;
      }

      await onSave(incomeData);
    } catch (err) {
      console.error("Error saving income:", err);
      setErrors((prev) => ({
        ...prev,
        form: "Failed to save the income entry. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  // Get combined categories list (budget categories + common categories)
  const allCategories = [...new Set([...categories, ...INCOME_CATEGORIES])];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {errors.form && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.form}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Description */}
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              disabled={loading}
              placeholder="Brief description of the income"
            />
          </Grid>

          {/* Category */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.category} required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
              >
                {allCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {errors.category && (
                <FormHelperText>{errors.category}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Amount */}
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="Amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              error={!!errors.amount}
              helperText={errors.amount}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Source */}
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="Source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              error={!!errors.source}
              helperText={errors.source}
              disabled={loading}
              placeholder="Source of the income"
            />
          </Grid>

          {/* Date */}
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date"
                value={formData.date}
                onChange={handleDateChange}
                disabled={loading}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!errors.date,
                    helperText: errors.date,
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Status */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
              >
                {INCOME_STATUSES.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Form Buttons */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 2,
              }}
            >
              <Button variant="outlined" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading && <CircularProgress size={20} />}
              >
                {loading
                  ? "Saving..."
                  : income
                  ? "Update Income"
                  : "Add Income"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default IncomeForm;
