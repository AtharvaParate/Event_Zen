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

// Common expense categories
const EXPENSE_CATEGORIES = [
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

// Payment status options
const PAYMENT_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "CANCELLED", label: "Cancelled" },
];

const ExpenseForm = ({
  expense,
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
    vendor: "",
    date: new Date(),
    paymentStatus: "PENDING",
    receiptUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form with expense data if editing
  useEffect(() => {
    if (expense) {
      setFormData({
        budgetId: expense.budgetId || budgetId || "",
        category: expense.category || "",
        amount: expense.amount?.toString() || "",
        description: expense.description || "",
        vendor: expense.vendor || "",
        date: expense.date ? new Date(expense.date) : new Date(),
        paymentStatus: expense.paymentStatus || "PENDING",
        receiptUrl: expense.receiptUrl || "",
      });
    }
  }, [expense, budgetId]);

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

    if (!formData.vendor.trim()) {
      newErrors.vendor = "Vendor name is required";
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
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        budgetId: budgetId || formData.budgetId,
      };

      // If editing, include the ID
      if (expense?.id) {
        expenseData.id = expense.id;
      }

      await onSave(expenseData);
    } catch (err) {
      console.error("Error saving expense:", err);
      setErrors((prev) => ({
        ...prev,
        form: "Failed to save the expense. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  // Get combined categories list (budget categories + common categories)
  const allCategories = [...new Set([...categories, ...EXPENSE_CATEGORIES])];

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
              placeholder="Brief description of the expense"
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

          {/* Vendor */}
          <Grid item xs={12} md={6}>
            <TextField
              required
              fullWidth
              label="Vendor"
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              error={!!errors.vendor}
              helperText={errors.vendor}
              disabled={loading}
              placeholder="Vendor or service provider name"
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

          {/* Payment Status */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Payment Status</InputLabel>
              <Select
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
                disabled={loading}
              >
                {PAYMENT_STATUSES.map((status) => (
                  <MenuItem key={status.value} value={status.value}>
                    {status.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Receipt URL */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Receipt URL (Optional)"
              name="receiptUrl"
              value={formData.receiptUrl}
              onChange={handleChange}
              disabled={loading}
              placeholder="URL to receipt or invoice"
            />
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
                  : expense
                  ? "Update Expense"
                  : "Add Expense"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default ExpenseForm;
