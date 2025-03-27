import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import { Email, Phone, Edit, Delete, Visibility } from "@mui/icons-material";

const AttendeeCard = ({ attendee, onView, onEdit, onDelete }) => {
  if (!attendee) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "REGISTERED":
        return "primary";
      case "CHECKED_IN":
        return "success";
      case "CANCELLED":
        return "error";
      case "NO_SHOW":
        return "warning";
      case "WAITLISTED":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 3,
        },
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          noWrap
          title={`${attendee.firstName} ${attendee.lastName}`}
          sx={{ fontWeight: 500, mb: 2 }}
        >
          {attendee.firstName} {attendee.lastName}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", my: 1.5 }}>
          <Email fontSize="small" color="primary" sx={{ mr: 1 }} />
          <Typography
            variant="body2"
            noWrap
            title={attendee.email}
            sx={{
              maxWidth: "calc(100% - 24px)",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {attendee.email}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Phone fontSize="small" color="primary" sx={{ mr: 1 }} />
          <Typography variant="body2">
            {attendee.phoneNumber || "Not provided"}
          </Typography>
        </Box>

        <Divider sx={{ mt: 1, mb: 2 }} />

        <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Chip
            label={
              attendee.status ? attendee.status.replace("_", " ") : "REGISTERED"
            }
            size="small"
            color={getStatusColor(attendee.status)}
          />
          {attendee.registrationIds && attendee.registrationIds.length > 0 && (
            <Chip
              label={`${attendee.registrationIds.length} Registration${
                attendee.registrationIds.length !== 1 ? "s" : ""
              }`}
              size="small"
              variant="outlined"
              color="secondary"
            />
          )}
        </Box>
      </CardContent>

      <CardActions
        sx={{
          justifyContent: "space-between",
          p: 2,
          pt: 1,
          borderTop: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <Button
          size="small"
          startIcon={<Visibility />}
          onClick={() => onView && onView(attendee.id)}
          color="primary"
        >
          View
        </Button>
        <Box>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                console.log("Edit button clicked for attendee:", attendee);
                if (onEdit) onEdit(attendee);
              }}
              aria-label="edit"
            >
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => {
                console.log("Delete button clicked for attendee:", attendee);
                if (onDelete) onDelete(attendee);
              }}
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

AttendeeCard.propTypes = {
  attendee: PropTypes.object.isRequired,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default AttendeeCard;
