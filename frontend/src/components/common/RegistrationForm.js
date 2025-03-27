import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Autocomplete,
} from "@mui/material";
import { Save, Cancel } from "@mui/icons-material";
import { fetchAttendees } from "../../api/attendeeApi";
import { fetchEvents } from "../../api/eventApi";

const initialFormState = {
  attendeeId: "",
  eventId: "",
  ticketType: "",
  ticketPrice: "",
  paymentMethod: "",
  paymentStatus: "PENDING",
  notes: "",
};

const RegistrationForm = ({
  registration,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [attendees, setAttendees] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    // Load initial data (attendees and events)
    const loadData = async () => {
      setLoadingData(true);
      try {
        // In a real app, you might want to handle pagination differently
        const attendeesData = await fetchAttendees(0, 100);
        const eventsData = await fetchEvents();

        setAttendees(attendeesData.content || []);
        setEvents(eventsData.content || []);
      } catch (error) {
        console.error("Error loading form data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (registration) {
      setFormData({
        ...initialFormState,
        ...registration,
      });
    }
  }, [registration]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
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

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.attendeeId) {
      newErrors.attendeeId = "Attendee is required";
    }

    if (!formData.eventId) {
      newErrors.eventId = "Event is required";
    }

    if (!formData.ticketType.trim()) {
      newErrors.ticketType = "Ticket type is required";
    }

    if (
      !formData.ticketPrice ||
      isNaN(formData.ticketPrice) ||
      Number(formData.ticketPrice) < 0
    ) {
      newErrors.ticketPrice = "Valid ticket price is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formattedData = {
        ...formData,
        ticketPrice: Number(formData.ticketPrice),
      };
      onSubmit(formattedData);
    }
  };

  const getAttendeeById = (id) => {
    return attendees.find((a) => a.id === id);
  };

  const getEventById = (id) => {
    return events.find((e) => e.id === id);
  };

  const getAttendeeDisplayName = (id) => {
    const attendee = getAttendeeById(id);
    return attendee
      ? `${attendee.firstName} ${attendee.lastName} (${attendee.email})`
      : "";
  };

  const getEventDisplayName = (id) => {
    const event = getEventById(id);
    return event ? event.name : "";
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {registration?.id ? "Edit Registration" : "Create New Registration"}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.attendeeId}>
              <Autocomplete
                options={attendees.map((a) => a.id)}
                getOptionLabel={(option) => getAttendeeDisplayName(option)}
                value={formData.attendeeId}
                onChange={(_, newValue) =>
                  handleAutocompleteChange("attendeeId", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Attendee"
                    error={!!errors.attendeeId}
                    helperText={errors.attendeeId}
                    required
                  />
                )}
                disabled={loading || loadingData}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.eventId}>
              <Autocomplete
                options={events.map((e) => e.id)}
                getOptionLabel={(option) => getEventDisplayName(option)}
                value={formData.eventId}
                onChange={(_, newValue) =>
                  handleAutocompleteChange("eventId", newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Event"
                    error={!!errors.eventId}
                    helperText={errors.eventId}
                    required
                  />
                )}
                disabled={loading || loadingData}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ticket Type"
              name="ticketType"
              value={formData.ticketType}
              onChange={handleChange}
              error={!!errors.ticketType}
              helperText={errors.ticketType}
              disabled={loading}
              required
              placeholder="e.g., VIP, Standard, Early Bird"
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Ticket Price"
              name="ticketPrice"
              type="number"
              value={formData.ticketPrice}
              onChange={handleChange}
              error={!!errors.ticketPrice}
              helperText={errors.ticketPrice}
              disabled={loading}
              required
              InputProps={{
                startAdornment: "$",
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Payment Method</InputLabel>
              <Select
                name="paymentMethod"
                value={formData.paymentMethod}
                label="Payment Method"
                onChange={handleChange}
                disabled={loading}
              >
                <MenuItem value="CREDIT_CARD">Credit Card</MenuItem>
                <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                <MenuItem value="CASH">Cash</MenuItem>
                <MenuItem value="PAYPAL">PayPal</MenuItem>
                <MenuItem value="CHECK">Check</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Payment Status</InputLabel>
              <Select
                name="paymentStatus"
                value={formData.paymentStatus}
                label="Payment Status"
                onChange={handleChange}
                disabled={loading}
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="FAILED">Failed</MenuItem>
                <MenuItem value="REFUNDED">Refunded</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              multiline
              rows={3}
              disabled={loading}
              placeholder="Any additional information about this registration"
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              {onCancel && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={onCancel}
                  disabled={loading || loadingData}
                  startIcon={<Cancel />}
                >
                  Cancel
                </Button>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || loadingData}
                startIcon={<Save />}
              >
                {loading ? "Saving..." : "Save Registration"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default RegistrationForm;
