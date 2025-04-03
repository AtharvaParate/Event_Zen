import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  Box,
  Divider,
  Chip,
  Paper,
  InputAdornment,
  Button,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import {
  Event as EventIcon,
  Person as PersonIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  Payment as PaymentIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import * as eventApi from "../../api/eventApi";

const PAYMENT_STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "REFUNDED", label: "Refunded" },
  { value: "FAILED", label: "Failed" },
];

const PAYMENT_METHODS = [
  { value: "CREDIT_CARD", label: "Credit Card" },
  { value: "DEBIT_CARD", label: "Debit Card" },
  { value: "PAYPAL", label: "PayPal" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CASH", label: "Cash" },
  { value: "OTHER", label: "Other" },
];

const RegistrationForm = ({
  initialData = {},
  events = [],
  attendees = [],
  onSave,
  mode = "create",
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    attendeeId: "",
    eventId: "",
    ticketType: "",
    paymentStatus: "PENDING",
    paymentMethod: "CREDIT_CARD",
    registrationDate: new Date().toISOString().split("T")[0],
    ...initialData,
  });

  const [errors, setErrors] = useState({});
  const [ticketTypes, setTicketTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      // Format the date correctly if it's a string
      let formattedData = { ...initialData };
      if (typeof formattedData.registrationDate === "string") {
        const date = new Date(formattedData.registrationDate);
        if (!isNaN(date.getTime())) {
          formattedData.registrationDate = date.toISOString().split("T")[0];
        }
      }
      setFormData(formattedData);
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.eventId) {
      fetchTicketTypes(formData.eventId);
    }
  }, [formData.eventId]);

  const fetchTicketTypes = async (eventId) => {
    if (!eventId) return;

    setIsLoading(true);
    try {
      const data = await eventApi.fetchTicketTypesByEventId(eventId);
      setTicketTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching ticket types:", error);
      // Fallback ticket types if API fails
      setTicketTypes([
        { id: "general", name: "General Admission", price: 50 },
        { id: "vip", name: "VIP", price: 100 },
        { id: "early-bird", name: "Early Bird", price: 35 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTicketTypes = async (eventId) => {
    if (!eventId) return;

    setIsLoading(true);
    try {
      const data = await eventApi.fetchTicketTypesByEventId(eventId);
      setTicketTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching ticket types:", error);
      // Fallback ticket types if API fails
      setTicketTypes([
        { id: "general", name: "General Admission", price: 50 },
        { id: "vip", name: "VIP", price: 100 },
        { id: "early-bird", name: "Early Bird", price: 35 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is updated
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleAutocompleteChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is updated
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.attendeeId) {
      tempErrors.attendeeId = "Attendee is required";
      isValid = false;
    }

    if (!formData.eventId) {
      tempErrors.eventId = "Event is required";
      isValid = false;
    }

    if (!formData.ticketType) {
      tempErrors.ticketType = "Ticket type is required";
      isValid = false;
    }

    if (!formData.paymentStatus) {
      tempErrors.paymentStatus = "Payment status is required";
      isValid = false;
    }

    if (!formData.paymentMethod) {
      tempErrors.paymentMethod = "Payment method is required";
      isValid = false;
    }

    if (!formData.registrationDate) {
      tempErrors.registrationDate = "Registration date is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Convert registration date to proper format before saving
      const dataToSave = {
        ...formData,
        registrationDate: formData.registrationDate
          ? new Date(formData.registrationDate).toISOString()
          : null,
      };
      onSave(dataToSave);
    }
  };

  // Find the selected event and attendee objects
  const selectedEvent =
    events.find((event) => event.id === formData.eventId) || {};
  const selectedAttendee =
    attendees.find((attendee) => attendee.id === formData.attendeeId) || {};

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {mode === "create" ? "Create New Registration" : "Edit Registration"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {mode === "create"
            ? "Fill in the details to register an attendee for an event"
            : "Update the registration details"}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Attendee Selection */}
        <Grid item xs={12}>
          <Autocomplete
            id="attendee-select"
            options={attendees}
            getOptionLabel={(option) => {
              // Handle both object and string cases
              if (!option) return "";
              if (typeof option === "string") return option;
              return `${option.firstName || ""} ${option.lastName || ""} (${
                option.email || "No email"
              })`;
            }}
            value={selectedAttendee.id ? selectedAttendee : null}
            onChange={(event, newValue) => {
              handleAutocompleteChange(
                "attendeeId",
                newValue ? newValue.id : ""
              );
            }}
            isOptionEqualToValue={(option, value) => {
              return option.id === (value ? value.id : null);
            }}
            disabled={mode === "edit" || isSubmitting}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Attendee *"
                error={!!errors.attendeeId}
                helperText={
                  errors.attendeeId ||
                  (attendees.length === 0 ? "No attendees available" : "")
                }
                fullWidth
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                {`${option.firstName || ""} ${option.lastName || ""} (${
                  option.email || "No email"
                })`}
              </li>
            )}
            loading={loadingEvents}
            loadingText="Loading attendees..."
          />
        </Grid>

        {/* Event Selection */}
        <Grid item xs={12}>
          <Autocomplete
            id="event-select"
            options={events}
            getOptionLabel={(option) => {
              // Handle both object and string cases
              if (!option) return "";
              if (typeof option === "string") return option;
              const title = option.name || option.title || `Event ${option.id}`;
              const date = option.startDate
                ? new Date(option.startDate).toLocaleDateString()
                : "No date";
              return `${title} (${date})`;
            }}
            value={selectedEvent.id ? selectedEvent : null}
            onChange={(event, newValue) => {
              console.log("Selected event:", newValue);
              console.log("Event ID being set:", newValue ? newValue.id : "");
              handleAutocompleteChange("eventId", newValue ? newValue.id : "");

              // Reset ticket types when changing event
              if (newValue && newValue.id !== formData.eventId) {
                fetchTicketTypes(newValue.id);
              }
            }}
            isOptionEqualToValue={(option, value) => {
              return option.id === (value ? value.id : null);
            }}
            disabled={mode === "edit" || isSubmitting}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Event *"
                error={!!errors.eventId}
                helperText={
                  errors.eventId ||
                  (events.length === 0 ? "No events available" : "")
                }
                fullWidth
              />
            )}
            renderOption={(props, option) => {
              const title = option.name || option.title || `Event ${option.id}`;
              const date = option.startDate
                ? new Date(option.startDate).toLocaleDateString()
                : "No date";
              return (
                <li {...props} key={option.id}>
                  {`${title} (${date})`}
                </li>
              );
            }}
            loading={loadingEvents}
            loadingText="Loading events..."
          />
        </Grid>

        {/* Ticket Type */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.ticketType}>
            <InputLabel id="ticket-type-label">Ticket Type *</InputLabel>
            <Select
              labelId="ticket-type-label"
              id="ticket-type"
              name="ticketType"
              value={formData.ticketType}
              onChange={handleChange}
              disabled={isSubmitting || isLoading}
            >
              {isLoading ? (
                <MenuItem value="">
                  <CircularProgress size={20} /> Loading...
                </MenuItem>
              ) : (
                ticketTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name} (${type.price})
                  </MenuItem>
                ))
              )}
            </Select>
            {errors.ticketType && (
              <FormHelperText>{errors.ticketType}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* Registration Date */}
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            id="registrationDate"
            name="registrationDate"
            label="Registration Date *"
            type="date"
            value={formData.registrationDate}
            onChange={handleChange}
            error={!!errors.registrationDate}
            helperText={errors.registrationDate}
            disabled={isSubmitting}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        {/* Payment Status */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.paymentStatus}>
            <InputLabel id="payment-status-label">Payment Status *</InputLabel>
            <Select
              labelId="payment-status-label"
              id="payment-status"
              name="paymentStatus"
              value={formData.paymentStatus}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="FAILED">Failed</MenuItem>
              <MenuItem value="REFUNDED">Refunded</MenuItem>
            </Select>
            {errors.paymentStatus && (
              <FormHelperText>{errors.paymentStatus}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* Payment Method */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.paymentMethod}>
            <InputLabel id="payment-method-label">Payment Method *</InputLabel>
            <Select
              labelId="payment-method-label"
              id="payment-method"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <MenuItem value="CREDIT_CARD">Credit Card</MenuItem>
              <MenuItem value="PAYPAL">PayPal</MenuItem>
              <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
              <MenuItem value="CASH">Cash</MenuItem>
            </Select>
            {errors.paymentMethod && (
              <FormHelperText>{errors.paymentMethod}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              startIcon={isSubmitting && <CircularProgress size={20} />}
            >
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                ? "Create Registration"
                : "Update Registration"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </form>
  );
};

RegistrationForm.propTypes = {
  initialData: PropTypes.object,
  events: PropTypes.array.isRequired,
  attendees: PropTypes.array.isRequired,
  onSave: PropTypes.func,
  mode: PropTypes.oneOf(["create", "edit"]),
  isSubmitting: PropTypes.bool,
};

RegistrationForm.defaultProps = {
  events: [],
  attendees: [],
  mode: "create",
  isSubmitting: false,
};

export default RegistrationForm;
