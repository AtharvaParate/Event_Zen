import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  PersonOutline,
  CheckCircleOutline,
  Edit,
  Delete,
  Visibility,
  EventOutlined,
  ReceiptOutlined,
} from "@mui/icons-material";
import PropTypes from "prop-types";

const getPaymentStatusColor = (status) => {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "PENDING":
      return "warning";
    case "FAILED":
      return "error";
    case "REFUNDED":
      return "info";
    default:
      return "default";
  }
};

const getCheckInStatusColor = (status) => {
  switch (status) {
    case "CHECKED_IN":
      return "success";
    case "NOT_CHECKED_IN":
      return "warning";
    default:
      return "default";
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount || 0);
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
};

const RegistrationCard = ({
  registration,
  onView,
  onEdit,
  onDelete,
  onCheckIn,
}) => {
  if (!registration) return null;

  const formattedDate = formatDate(registration.registrationDate);
  const eventName =
    registration.event?.name || registration.event?.title || "Unknown Event";
  const attendeeName = `${registration.attendee?.firstName || ""} ${
    registration.attendee?.lastName || ""
  }`.trim();

  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <EventOutlined fontSize="small" color="primary" sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              gutterBottom
              noWrap
              title={eventName}
              sx={{ mb: 0 }}
            >
              {eventName}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            <strong>Confirmation:</strong> {registration.confirmationNumber}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <strong>Registered:</strong> {formattedDate}
          </Typography>
        </Box>

        <Divider sx={{ my: 1.5 }} />

        <Box sx={{ my: 1.5 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <PersonOutline fontSize="small" color="primary" sx={{ mr: 1 }} />
            <Typography
              variant="body2"
              fontWeight="medium"
              noWrap
              title={attendeeName}
            >
              {attendeeName || "Unknown Attendee"}
            </Typography>
          </Box>

          {registration.attendee?.email && (
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{ ml: 3 }}
              title={registration.attendee.email}
            >
              {registration.attendee.email}
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 2, mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
            <ReceiptOutlined fontSize="small" color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2" fontWeight="medium">
              {registration.ticketType || "Standard Ticket"}
              {registration.ticketPrice && (
                <Typography
                  component="span"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  ({formatCurrency(registration.ticketPrice)})
                </Typography>
              )}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ ml: 3 }}>
            Payment:{" "}
            {registration.paymentMethod?.replace("_", " ") || "Unknown method"}
          </Typography>
        </Box>

        <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Chip
            label={registration.paymentStatus?.replace("_", " ") || "Unknown"}
            size="small"
            color={getPaymentStatusColor(registration.paymentStatus)}
          />
          <Chip
            label={
              registration.checkInStatus === "CHECKED_IN"
                ? "Checked In"
                : "Not Checked In"
            }
            size="small"
            color={getCheckInStatusColor(registration.checkInStatus)}
          />
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", p: 1.5, pt: 0 }}>
        <Button size="small" startIcon={<Visibility />} onClick={onView}>
          Details
        </Button>
        <Box>
          {registration.checkInStatus !== "CHECKED_IN" && (
            <Tooltip title="Check In">
              <IconButton
                size="small"
                color="success"
                onClick={onCheckIn}
                aria-label="check in"
              >
                <CheckCircleOutline />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={onEdit}
              aria-label="edit"
              sx={{ ml: 0.5 }}
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={onDelete}
              aria-label="delete"
              sx={{ ml: 0.5 }}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
};

RegistrationCard.propTypes = {
  registration: PropTypes.object.isRequired,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onCheckIn: PropTypes.func,
};

export default RegistrationCard;
