import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Pagination,
  TextField,
  MenuItem,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  LocationOn as LocationOnIcon,
  Event as EventIcon,
} from "@mui/icons-material";
import { fetchEvents, deleteEvent } from "../store/eventSlice";

const EventsListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(
    parseInt(queryParams.get("page")) || 1
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const { events, loading, pagination } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (eventToDelete) {
      try {
        await dispatch(deleteEvent(eventToDelete.id)).unwrap();
        setDeleteDialogOpen(false);
        // Refresh the events list
        dispatch(fetchEvents({ page: currentPage - 1, size: 9 }));
      } catch (error) {
        console.error("Failed to delete event:", error);
      }
    }
    setDeleteDialogOpen(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };

  // Enhanced date formatting function to handle various date formats
  const formatDateTime = (dateString) => {
    if (!dateString) {
      console.warn("Empty dateString encountered");
      return "Date not specified";
    }

    console.log("EventsList formatDateTime called with:", typeof dateString, JSON.stringify(dateString, null, 2));

    // Create a fallback display for arrays
    const createFallbackDisplay = (arr) => {
      if (!Array.isArray(arr) || arr.length < 3) return "Date format invalid";
      
      // Try to create a human-readable fallback
      try {
        const months = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        
        const year = arr[0];
        const month = arr[1] - 1; // 0-based month
        const day = arr[2];
        const hour = arr.length >= 4 ? arr[3] : 0;
        const minute = arr.length >= 5 ? arr[4] : 0;
        
        const monthName = months[month] || `Month ${month+1}`;
        const timeStr = `${hour}:${String(minute).padStart(2, '0')}`;
        
        return `${monthName} ${day}, ${year} at ${timeStr}`;
      } catch (e) {
        // If anything goes wrong with the fallback, return a basic format
        return arr.join('-');
      }
    };

    try {
      // If the date is an array (as returned by Java backend), convert it to a proper date string
      if (Array.isArray(dateString)) {
        console.log("Processing array date:", dateString);
        // Format: [year, month, day, hour, minute, second, ...]
        if (dateString.length >= 3) {
          const year = dateString[0];
          const month = dateString[1] - 1; // Month is 0-indexed in JS
          const day = dateString[2];
          const hour = dateString.length >= 4 ? dateString[3] : 0;
          const minute = dateString.length >= 5 ? dateString[4] : 0;

          console.log(`Creating date with: year=${year}, month=${month}, day=${day}, hour=${hour}, minute=${minute}`);
          
          // Use alternative date creation methods for better compatibility
          // Method 1: ISO String approach
          const isoString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`;
          console.log("Created ISO string:", isoString);
          
          let date = new Date(isoString);
          
          // Fallback to direct constructor if ISO approach fails
          if (isNaN(date.getTime())) {
            console.log("ISO approach failed, trying direct constructor");
            date = new Date(year, month, day, hour, minute);
          }
          
          console.log("Created date object:", date.toString(), "Valid:", !isNaN(date.getTime()));

          if (isNaN(date.getTime())) {
            console.warn("Invalid date array:", dateString);
            // Return fallback format instead of error message
            return createFallbackDisplay(dateString);
          }

          const formattedDate = date.toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
          console.log("Formatted date:", formattedDate);
          return formattedDate;
        }
        console.warn("Array date doesn't have enough elements:", dateString);
        return createFallbackDisplay(dateString);
      }

      // Handle timestamp arrays that might be nested objects
      if (
        dateString &&
        typeof dateString === "object" &&
        "timestamp" in dateString
      ) {
        console.log("Found timestamp object:", dateString);
        return formatDateTime(dateString.timestamp);
      }

      // Handle ISO strings and other string formats
      if (typeof dateString === "string") {
        console.log("Processing string date:", dateString);
        const date = new Date(dateString);
        console.log("Created date from string:", date.toString(), "Valid:", !isNaN(date.getTime()));
        
        if (!isNaN(date.getTime())) {
          const formattedDate = date.toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });
          console.log("Formatted string date:", formattedDate);
          return formattedDate;
        }
      }

      console.warn("Unhandled date format:", typeof dateString, dateString);
      if (Array.isArray(dateString)) {
        return createFallbackDisplay(dateString);
      }
      return typeof dateString === 'string' ? dateString : "Date not available";
    } catch (error) {
      console.error("Date formatting error:", error, dateString);
      if (Array.isArray(dateString)) {
        return createFallbackDisplay(dateString);
      }
      return "Date not available";
    }
  };

  // Helper function to check if a location is valid or default
  const formatLocation = (location) => {
    if (!location) return "Location not specified";

    if (typeof location !== "string") {
      console.warn("Non-string location:", location);
      return "Location not specified";
    }

    // Check if it's an empty string or just whitespace
    if (location.trim() === "") {
      return "Location not specified";
    }

    // Check for common default location names
    const defaultLocations = [
      "Test Location",
      "test location",
      "test",
      "Test",
      "TBD",
      "tbd",
      "To be determined",
      "to be determined",
      "Location",
    ];

    if (
      defaultLocations.some(
        (defaultLoc) =>
          location.trim().toLowerCase() === defaultLoc.toLowerCase()
      )
    ) {
      return "Location to be announced";
    }

    return location;
  };

  // Helper function to get a consistent image index from any event ID
  const getImageIndex = (id) => {
    if (!id) return 1;

    try {
      // If the ID is a number or can be parsed as a hex value
      if (typeof id === "number") {
        return (id % 3) + 1;
      }

      // For string IDs
      if (typeof id === "string") {
        // Try to get some numerical value from the ID
        // Method 1: Parse as integer if possible
        if (!isNaN(parseInt(id))) {
          return (parseInt(id) % 3) + 1;
        }

        // Method 2: Add up character codes
        let sum = 0;
        for (let i = 0; i < id.length; i++) {
          sum += id.charCodeAt(i);
        }
        return (sum % 3) + 1;
      }

      // Default
      return 1;
    } catch (error) {
      console.error("Error determining image index:", error);
      return 1;
    }
  };

  const renderEventCard = (event) => {
    // Check if current user is the organizer
    const isOrganizer = user && event.organizerId === user.id;

    return (
      <Card
        key={event.id}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.2s",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: 6,
          },
        }}
      >
        <CardMedia
          component="img"
          height="140"
          image={`${process.env.PUBLIC_URL}/images/events/event-${getImageIndex(
            event.id
          )}.avif`}
          alt={event.title}
          onError={(e) => {
            console.log(`Failed to load image for event: ${event.id}`);
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = `${process.env.PUBLIC_URL}/images/defaults/event-default.avif`;
          }}
        />

        <CardContent sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <Typography gutterBottom variant="h6" component="div" noWrap>
              {event.title}
            </Typography>

            {isOrganizer && (
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(event);
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>

          <Chip
            label={event.category || "Uncategorized"}
            size="small"
            color="primary"
            sx={{ mb: 1 }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <EventIcon
              fontSize="small"
              sx={{ mr: 0.5, verticalAlign: "middle" }}
            />
            {formatDateTime(event.startTime || event.startDate)}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={{ mb: 1 }}
          >
            <LocationOnIcon
              fontSize="small"
              sx={{ mr: 0.5, verticalAlign: "middle" }}
            />
            {formatLocation(event.location)}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {event.description}
          </Typography>
        </CardContent>

        <CardActions>
          <Button size="small" onClick={() => navigate(`/events/${event.id}`)}>
            View Details
          </Button>

          {isOrganizer && (
            <Button
              size="small"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/events/edit/${event.id}`);
              }}
            >
              Edit
            </Button>
          )}
        </CardActions>
      </Card>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ... existing code ... */}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Event</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete "{eventToDelete?.title}"? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventsListPage;
