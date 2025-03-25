import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Chip,
  Divider,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide,
} from "@mui/material";
import {
  CalendarMonth as CalendarIcon,
  LocationOn as LocationIcon,
  AttachMoney as PriceIcon,
  Group as CapacityIcon,
  Category as CategoryIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import { fetchEvent, deleteEvent } from "../store/eventSlice";
import PageHeader from "../components/common/PageHeader";
import Loading from "../components/common/Loading";

// Custom transition component to prevent scrollTop errors
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const EventDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { event, loading, error } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchEvent(id));
  }, [dispatch, id]);

  const handleEditClick = () => {
    navigate(`/events/edit/${id}`);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteEvent(id)).unwrap();
      setDeleteDialogOpen(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to delete event:", error);
      setDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  const handleRegisterClick = () => {
    setRegisterDialogOpen(true);
  };

  const handleRegisterConfirm = () => {
    console.log("Registering for event:", event.id);
    // In a real app, this would make an API call to register the user
    setRegisterDialogOpen(false);
    // Show success message or update UI
    alert("You've successfully registered for this event!");
  };

  const handleRegisterCancel = () => {
    setRegisterDialogOpen(false);
  };

  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;

      // Format date as: Month DD, YYYY at HH:MM AM/PM
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return <Loading message="Loading event details..." />;
  }

  if (error) {
    return (
      <Box sx={{ py: 8, textAlign: "center", width: "100%" }}>
        <Typography variant="h5" color="error">
          Error loading event: {error}
        </Typography>
        <Button
          sx={{ mt: 3 }}
          variant="contained"
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  if (!event) {
    return (
      <Box sx={{ py: 8, textAlign: "center", width: "100%" }}>
        <Typography variant="h5">Event not found</Typography>
        <Button
          sx={{ mt: 3 }}
          variant="contained"
          onClick={() => navigate("/events")}
          startIcon={<ArrowBackIcon />}
        >
          Browse Events
        </Button>
      </Box>
    );
  }

  // Check if current user is the organizer
  const isOrganizer = user && event.organizer && user.id === event.organizer.id;

  return (
    <Box
      sx={{
        width: "100%",
        px: { xs: 2, sm: 4 },
        maxWidth: "1600px",
        mx: "auto",
        mt: 4,
        mb: 8,
      }}
    >
      <PageHeader
        title={event.title}
        subtitle="Event Details"
        breadcrumbs={[
          { label: "Events", link: "/events" },
          { label: event.title },
        ]}
        action={isOrganizer}
        actionText="Edit Event"
        actionIcon={<EditIcon />}
        onActionClick={handleEditClick}
      />

      <Grid container spacing={4}>
        {/* Event Image */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image={`${process.env.PUBLIC_URL}/images/events/event-${
                (id % 3) + 1
              }.avif`}
              alt={event.title}
              onError={(e) => {
                console.log(
                  `Event detail image load error for event ${id}, using default fallback`
                );
                e.target.onerror = null; // Prevent infinite loop

                // Direct fallback to default
                e.target.src = `${process.env.PUBLIC_URL}/images/defaults/event-default.avif`;
              }}
            />
          </Card>
        </Grid>

        {/* Event Details */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h5" component="h2">
                Details
              </Typography>

              {isOrganizer && (
                <IconButton color="error" onClick={handleDeleteClick}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CalendarIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">
                    <strong>Start:</strong> {formatDateTime(event.startDate)}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CalendarIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">
                    <strong>End:</strong> {formatDateTime(event.endDate)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">{event.location}</Typography>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PriceIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">
                    {event.price === 0 ? "Free" : `$${event.price.toFixed(2)}`}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CapacityIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">
                    Capacity: {event.capacity}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <CategoryIcon sx={{ mr: 1, color: "primary.main" }} />
                  <Chip label={event.category} color="primary" size="small" />
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  size="large"
                  sx={{ mt: 2 }}
                  onClick={handleRegisterClick}
                >
                  Register for Event
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Event Description */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About This Event
              </Typography>
              <Typography variant="body1" component="div">
                {event.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        TransitionComponent={Transition}
        disableScrollLock
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete this event?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete "{event.title}"? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Register for Event Dialog */}
      <Dialog
        open={registerDialogOpen}
        onClose={handleRegisterCancel}
        aria-labelledby="register-dialog-title"
        aria-describedby="register-dialog-description"
        TransitionComponent={Transition}
        disableScrollLock
      >
        <DialogTitle id="register-dialog-title">
          {"Register for this event?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="register-dialog-description">
            Are you sure you want to register for "{event.title}"? You will
            receive a confirmation email with event details.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRegisterCancel}>Cancel</Button>
          <Button onClick={handleRegisterConfirm} color="primary" autoFocus>
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventDetailPage;
