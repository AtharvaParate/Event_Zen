import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  Typography,
  Paper,
  Box,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Autocomplete,
  Divider,
} from "@mui/material";
import PropTypes from "prop-types";
import { fetchEvents } from "../../api/eventApi";

/**
 * AttendeeForm - A reusable form component for creating and editing attendees
 * @param {Object} props - Component props
 * @param {Object} props.initialValues - Initial form values
 * @param {Function} props.onSubmit - Function called when form is submitted
 * @param {Boolean} props.isLoading - Loading state
 * @param {String} props.submitButtonText - Text for the submit button
 * @param {Boolean} props.isEdit - Whether the form is for editing an existing attendee
 */
const AttendeeForm = ({
  initialValues = null,
  onSubmit,
  isLoading = false,
  submitButtonText = "Submit",
  isEdit = false,
}) => {
  // Initialize with default values
  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    status: "REGISTERED",
  };

  // Set initial state with defaults to prevent null access
  const [formValues, setFormValues] = useState(
    initialValues
      ? { ...defaultValues, ...initialValues }
      : { ...defaultValues }
  );
  const [errors, setErrors] = useState({});
  const [registerForEvent, setRegisterForEvent] = useState(false);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [ticketOptions, setTicketOptions] = useState([
    { type: "STANDARD", price: 75 },
    { type: "VIP", price: 150 },
    { type: "EARLY_BIRD", price: 50 },
    { type: "GROUP", price: 60 },
    { type: "STUDENT", price: 25 },
  ]);

  // Payment method options
  const paymentMethods = [
    { value: "CREDIT_CARD", label: "Credit Card" },
    { value: "PAYPAL", label: "PayPal" },
    { value: "BANK_TRANSFER", label: "Bank Transfer" },
    { value: "CASH", label: "Cash" },
  ];

  // Update form values when initialValues changes
  useEffect(() => {
    console.log("Initial values changed:", initialValues);

    // Create a shallow copy of initialValues or use default values
    // Handle the case where initialValues might be null
    const newValues = initialValues
      ? { ...defaultValues, ...initialValues }
      : { ...defaultValues };

    console.log("Setting form values to:", newValues);
    setFormValues(newValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]); // intentionally omitting defaultValues as it's a constant

  // Load events when the form mounts or when register checkbox is checked
  useEffect(() => {
    if (registerForEvent) {
      loadEvents();
    }
  }, [registerForEvent]);

  // Function to load events from the API
  const loadEvents = async () => {
    setLoadingEvents(true);
    try {
      console.log("Loading events for registration...");
      const response = await fetchEvents();
      console.log("Events loaded:", response);

      const eventList = Array.isArray(response)
        ? response
        : response.content || [];

      setEvents(eventList);
    } catch (error) {
      console.error("Error loading events:", error);
      // Use mock events if the API fails
      setEvents([
        {
          id: "event-1",
          title: "Annual Tech Conference",
          location: "San Francisco, CA",
        },
        { id: "event-2", title: "Music Festival", location: "Los Angeles, CA" },
        { id: "event-3", title: "Business Workshop", location: "New York, NY" },
      ]);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);

    // Ensure we're handling null/undefined values properly
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    if (name === "registerForEvent") {
      setRegisterForEvent(checked);
    } else {
      setFormValues((prev) => ({
        ...prev,
        [name]: checked,
      }));
    }
  };

  const handleEventChange = (event, newValue) => {
    setSelectedEvent(newValue);
    if (newValue) {
      setFormValues((prev) => ({
        ...prev,
        eventId: newValue.id,
      }));
    } else {
      setFormValues((prev) => {
        const newValues = { ...prev };
        delete newValues.eventId;
        return newValues;
      });
    }
  };

  const handleTicketTypeChange = (e) => {
    const selectedType = e.target.value;
    const selectedTicket = ticketOptions.find(
      (ticket) => ticket.type === selectedType
    );

    setFormValues((prev) => ({
      ...prev,
      ticketType: selectedType,
      ticketPrice: selectedTicket ? selectedTicket.price : 0,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Safely check if properties exist before validation
    if (!formValues?.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formValues?.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formValues?.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      newErrors.email = "Email is invalid";
    }

    // Phone number is optional but should be valid if provided
    if (
      formValues?.phoneNumber?.trim() &&
      !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(
        formValues.phoneNumber
      )
    ) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    // Check event registration fields if registering for an event
    if (registerForEvent) {
      if (!formValues?.eventId) {
        newErrors.eventId = "Please select an event";
      }

      if (!formValues?.ticketType) {
        newErrors.ticketType = "Please select a ticket type";
      }

      if (!formValues?.paymentMethod) {
        newErrors.paymentMethod = "Please select a payment method";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event propagation to prevent dialog issues

    // Ensure we have a valid formValues object
    if (!formValues) {
      console.error("Form values are null or undefined");
      return;
    }

    console.log("Attempting to submit form with values:", formValues);

    if (validateForm()) {
      // Create a clean copy of the form data
      const finalFormData = { ...formValues };

      // Add registration info if registering for an event
      if (registerForEvent) {
        finalFormData.registerForEvent = true;

        // Make sure we have event details
        if (!finalFormData.eventId && selectedEvent) {
          finalFormData.eventId = selectedEvent.id;
        }

        // Set default ticket price if not set
        if (finalFormData.ticketType && !finalFormData.ticketPrice) {
          const selectedTicket = ticketOptions.find(
            (ticket) => ticket.type === finalFormData.ticketType
          );
          if (selectedTicket) {
            finalFormData.ticketPrice = selectedTicket.price;
          }
        }
      } else {
        // Remove event-related fields if not registering
        delete finalFormData.eventId;
        delete finalFormData.ticketType;
        delete finalFormData.ticketPrice;
        delete finalFormData.paymentMethod;
        delete finalFormData.registerForEvent;
      }

      // Remove any empty fields to prevent API errors
      Object.keys(finalFormData).forEach((key) => {
        if (
          finalFormData[key] === "" ||
          finalFormData[key] === null ||
          finalFormData[key] === undefined
        ) {
          delete finalFormData[key];
        }
      });

      // Ensure required fields exist
      const requiredFields = {
        firstName: finalFormData.firstName || "",
        lastName: finalFormData.lastName || "",
        email: finalFormData.email || "",
        status: finalFormData.status || "REGISTERED",
      };

      const cleanedData = {
        ...requiredFields,
        ...finalFormData,
      };

      console.log("Submitting cleaned form data:", cleanedData);
      onSubmit(cleanedData);
    } else {
      console.warn("Form validation failed");
    }
  };

  return (
    <Paper elevation={isEdit ? 0 : 2} sx={{ p: 3 }}>
      <Box component="div" noValidate>
        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          {isEdit ? "Edit Attendee" : "Create New Attendee"}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoFocus
              label="First Name"
              name="firstName"
              value={formValues?.firstName || ""}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.firstName}
              helperText={errors.firstName}
              disabled={isLoading}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="lastName"
              value={formValues?.lastName || ""}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.lastName}
              helperText={errors.lastName}
              disabled={isLoading}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formValues?.email || ""}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.email}
              helperText={errors.email}
              disabled={isLoading || (isEdit && formValues?.email)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              name="phoneNumber"
              value={formValues?.phoneNumber || ""}
              onChange={handleChange}
              fullWidth
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              disabled={isLoading}
              placeholder="e.g., 123-456-7890"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth error={!!errors.status} variant="outlined">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="status"
                value={formValues?.status || "REGISTERED"}
                onChange={handleChange}
                label="Status"
                disabled={isLoading}
              >
                <MenuItem value="REGISTERED">Registered</MenuItem>
                <MenuItem value="CHECKED_IN">Checked In</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
                <MenuItem value="NO_SHOW">No Show</MenuItem>
                <MenuItem value="WAITLISTED">Waitlisted</MenuItem>
              </Select>
              {errors.status && (
                <FormHelperText>{errors.status}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {!isEdit && (
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={registerForEvent}
                    onChange={handleCheckboxChange}
                    name="registerForEvent"
                    color="primary"
                    disabled={isLoading}
                  />
                }
                label="Register for an event"
              />
            </Grid>
          )}

          {registerForEvent && (
            <>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  sx={{ mt: 2, mb: 1, fontWeight: 500 }}
                >
                  Event Registration Details
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  id="event-select"
                  options={events}
                  getOptionLabel={(option) => option.title || ""}
                  value={selectedEvent}
                  onChange={handleEventChange}
                  loading={loadingEvents}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Event"
                      required
                      error={!!errors.eventId}
                      helperText={errors.eventId}
                      variant="outlined"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingEvents ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  disabled={isLoading}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  error={!!errors.ticketType}
                  variant="outlined"
                >
                  <InputLabel id="ticket-type-label">Ticket Type</InputLabel>
                  <Select
                    labelId="ticket-type-label"
                    name="ticketType"
                    value={formValues.ticketType || ""}
                    onChange={handleTicketTypeChange}
                    label="Ticket Type"
                    disabled={isLoading}
                  >
                    {ticketOptions.map((option) => (
                      <MenuItem key={option.type} value={option.type}>
                        {option.type} (${option.price})
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.ticketType && (
                    <FormHelperText>{errors.ticketType}</FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  error={!!errors.paymentMethod}
                  variant="outlined"
                >
                  <InputLabel id="payment-method-label">
                    Payment Method
                  </InputLabel>
                  <Select
                    labelId="payment-method-label"
                    name="paymentMethod"
                    value={formValues.paymentMethod || ""}
                    onChange={handleChange}
                    label="Payment Method"
                    disabled={isLoading}
                  >
                    {paymentMethods.map((method) => (
                      <MenuItem key={method.value} value={method.value}>
                        {method.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.paymentMethod && (
                    <FormHelperText>{errors.paymentMethod}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </>
          )}

          <Grid item xs={12} sx={{ mt: 3 }}>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
              sx={{ py: 1.5 }}
              startIcon={isLoading ? <CircularProgress size={24} /> : null}
            >
              {isLoading ? "Processing..." : submitButtonText}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

AttendeeForm.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  submitButtonText: PropTypes.string,
  isEdit: PropTypes.bool,
};

export default AttendeeForm;
