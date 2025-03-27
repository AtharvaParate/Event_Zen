import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Box,
  CardActions,
  Button,
  Tooltip,
} from "@mui/material";
import {
  Info as InfoIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import { format } from "date-fns";

const getStatusColor = (status) => {
  switch (status) {
    case "REGISTERED":
      return "success";
    case "PENDING":
      return "warning";
    case "CHECKED_IN":
      return "info";
    case "CANCELLED":
      return "error";
    default:
      return "default";
  }
};

const AttendeeCard = ({ attendee, onView, onEdit, onDelete }) => {
  if (!attendee) {
    console.warn("AttendeeCard received a null or undefined attendee");
    return null;
  }

  const handleView = () => {
    console.log(`View attendee: ${attendee.id}`);
    if (onView) {
      onView(attendee);
    } else {
      console.warn("onView handler is not defined");
    }
  };

  const handleEdit = () => {
    console.log(`Edit attendee: ${attendee.id}`);
    if (onEdit) {
      onEdit(attendee);
    } else {
      console.warn("onEdit handler is not defined");
    }
  };

  const handleDelete = () => {
    console.log(`Delete attendee: ${attendee.id}`);
    if (onDelete) {
      onDelete(attendee);
    } else {
      console.warn("onDelete handler is not defined");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (err) {
      console.warn(`Error formatting date: ${dateString}`, err);
      return "Unknown date";
    }
  };

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
            {attendee.firstName ? attendee.firstName.charAt(0).toUpperCase() : "A"}
          </Avatar>
          <Box>
            <Typography variant="h6" component="div">
              {attendee.firstName} {attendee.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {attendee.email}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Chip
              label={attendee.status || "REGISTERED"}
              size="small"
              color={getStatusColor(attendee.status)}
              sx={{ mr: 1 }}
            />
            {attendee.createdAt && (
              <Typography variant="caption" color="text.secondary">
                Registered on {formatDate(attendee.createdAt)}
              </Typography>
            )}
          </Box>

          {attendee.phoneNumber && (
            <Typography variant="body2" color="text.secondary">
              Phone: {attendee.phoneNumber}
            </Typography>
          )}

          {attendee.registrationIds && attendee.registrationIds.length > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <EventIcon fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {attendee.registrationIds.length}{" "}
                {attendee.registrationIds.length === 1 ? "Registration" : "Registrations"}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end", pt: 0 }}>
        <Tooltip title="View Details">
          <Button
            size="small"
            onClick={handleView}
            startIcon={<InfoIcon />}
          >
            View
          </Button>
        </Tooltip>
        <Tooltip title="Edit Attendee">
          <Button
            size="small"
            color="primary"
            onClick={handleEdit}
            startIcon={<EditIcon />}
          >
            Edit
          </Button>
        </Tooltip>
        <Tooltip title="Delete Attendee">
          <Button
            size="small"
            color="error"
            onClick={handleDelete}
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default AttendeeCard; 