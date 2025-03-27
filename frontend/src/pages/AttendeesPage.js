import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Pagination,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip,
  Snackbar,
  Skeleton,
} from "@mui/material";
import {
  Add,
  Search,
  Clear,
  FilterList,
  Refresh,
  SearchOff,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AttendeeCard from "../components/common/AttendeeCard";
import AttendeeForm from "../components/forms/AttendeeForm";
import {
  fetchAttendees,
  createAttendee,
  updateAttendee,
  deleteAttendee,
  searchAttendees,
} from "../api/attendeeApi";

const SearchContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  flexWrap: "wrap",
  width: "100%",
}));

const FiltersContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  flexWrap: "wrap",
  alignItems: "center",
}));

const AttendeesPage = () => {
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentAttendee, setCurrentAttendee] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  // Function to show a snackbar message
  const showMessage = (message, severity = "info") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Function to close the snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false,
    });
  };

  const loadAttendees = async (
    page = currentPage,
    filterStatus = statusFilter,
    search = searchTerm
  ) => {
    setLoading(true);
    setError(null);
    console.log(
      `Loading attendees: page=${page}, filter=${filterStatus}, search=${search}`
    );

    try {
      let result;
      if (search) {
        // Search with filters
        result = await searchAttendees(search, {
          status: filterStatus !== "ALL" ? filterStatus : null,
        });
        console.log("Search results:", result);
      } else {
        // Get all with pagination
        result = await fetchAttendees(page, 9);
        console.log("Fetched attendees:", result);
      }

      // Process the data from the API
      let fetchedAttendees = Array.isArray(result)
        ? result
        : result.content || [];

      // Ensure each attendee has the required fields
      fetchedAttendees = fetchedAttendees.map((attendee) => ({
        id: attendee.id || `temp-${Math.random().toString(36).substring(2)}`,
        firstName: attendee.firstName || "",
        lastName: attendee.lastName || "",
        email: attendee.email || "",
        phoneNumber: attendee.phoneNumber || attendee.phone || "",
        status: attendee.status || "REGISTERED",
        registrationIds: attendee.registrationIds || [],
        ...attendee, // Keep other properties
      }));

      console.log("Processed attendees:", fetchedAttendees);

      setAttendees(fetchedAttendees);
      setTotalPages(result.totalPages || 1);
      setCurrentPage(page);
      setError(null);
    } catch (err) {
      console.error("Error loading attendees:", err);
      setError("Failed to load attendees. Please try again.");

      // For development, provide mock data if the API fails
      if (process.env.NODE_ENV === "development") {
        console.warn("Using mock attendee data for development");
        const mockAttendees = [
          {
            id: "mock-1",
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            phoneNumber: "123-456-7890",
            userId: "user-1",
            status: "REGISTERED",
            registrationIds: ["reg-1", "reg-2"],
          },
          {
            id: "mock-2",
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            phoneNumber: "987-654-3210",
            userId: "user-2",
            status: "CHECKED_IN",
            registrationIds: ["reg-3"],
          },
          {
            id: "mock-3",
            firstName: "Bob",
            lastName: "Johnson",
            email: "bob.johnson@example.com",
            phoneNumber: "555-123-4567",
            userId: "user-3",
            status: "CANCELLED",
            registrationIds: ["reg-4"],
          },
          {
            id: "mock-4",
            firstName: "Alice",
            lastName: "Williams",
            email: "alice.williams@example.com",
            phoneNumber: "333-222-1111",
            userId: "user-4",
            status: "REGISTERED",
            registrationIds: ["reg-5"],
          },
          {
            id: "mock-5",
            firstName: "Charlie",
            lastName: "Brown",
            email: "charlie.brown@example.com",
            phoneNumber: "444-555-6666",
            userId: "user-5",
            status: "CHECKED_IN",
            registrationIds: ["reg-6"],
          },
          {
            id: "mock-6",
            firstName: "Emma",
            lastName: "Davis",
            email: "emma.davis@example.com",
            phoneNumber: "777-888-9999",
            userId: "user-6",
            status: "REGISTERED",
            registrationIds: ["reg-7"],
          },
        ];

        // Filter by status if needed
        const filteredAttendees =
          statusFilter === "ALL"
            ? mockAttendees
            : mockAttendees.filter((a) => a.status === statusFilter);

        setAttendees(filteredAttendees);
        setTotalPages(1);
        setCurrentPage(0);
        showMessage("Using mock data - backend connection failed", "warning");
      }
    } finally {
      setLoading(false);
    }
  };

  // Load attendees on component mount and when dependencies change
  useEffect(() => {
    loadAttendees(0, statusFilter, searchTerm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, searchTerm]); // loadAttendees omitted to prevent infinite loops

  const handleSearch = () => {
    loadAttendees(0, statusFilter, searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    loadAttendees(0, statusFilter, "");
  };

  const handleRefresh = () => {
    loadAttendees(currentPage, statusFilter, searchTerm);
    showMessage("Data refreshed", "info");
  };

  const handlePageChange = (event, page) => {
    loadAttendees(page - 1, statusFilter, searchTerm);
  };

  const handleAddAttendee = () => {
    // Reset current attendee to null before opening the dialog
    setCurrentAttendee(null);
    setShowAddDialog(true);
  };

  const handleEditAttendee = (attendee) => {
    console.log(`Navigating to edit page for attendee ${attendee.id}`);
    navigate(`/attendees/edit/${attendee.id}`);
  };

  const handleDeleteAttendee = (attendee) => {
    console.log("Deleting attendee:", attendee);
    // Make a deep copy of the attendee to avoid reference issues
    const attendeeToDelete = JSON.parse(JSON.stringify(attendee));
    setCurrentAttendee(attendeeToDelete);
    // Ensure dialog opens after attendee is set
    setTimeout(() => {
      setShowDeleteDialog(true);
    }, 0);
  };

  const handleViewAttendee = (attendeeId) => {
    console.log("Navigating to attendee detail page", attendeeId);
    // Ensure we have a valid attendee ID before navigating
    if (attendeeId) {
      navigate(`/attendees/${attendeeId}`);
    } else {
      setError("Cannot view attendee: Invalid ID");
      showMessage("Cannot view attendee: Invalid ID", "error");
    }
  };

  const handleFormSubmit = async (formData) => {
    setFormSubmitting(true);
    console.log("Form data for attendee:", formData);

    try {
      let attendee;

      if (showAddDialog) {
        console.log("Creating attendee with data:", formData);

        // Ensure required fields are present
        const attendeeData = {
          firstName: formData.firstName || "",
          lastName: formData.lastName || "",
          email: formData.email || "",
          phoneNumber: formData.phoneNumber || "",
          status: formData.status || "REGISTERED",
          ...formData,
        };

        // Create the attendee
        try {
          attendee = await createAttendee(attendeeData);
          console.log("Created attendee:", attendee);
        } catch (createError) {
          console.error("Error during attendee creation:", createError);
          throw createError;
        }

        // In development mode, provide mock data if backend fails
        if (!attendee && process.env.NODE_ENV === "development") {
          console.warn("Using mock attendee data for development");
          attendee = {
            id: `mock-${Math.random().toString(36).substring(2, 9)}`,
            firstName: attendeeData.firstName,
            lastName: attendeeData.lastName,
            email: attendeeData.email,
            phoneNumber: attendeeData.phoneNumber || "",
            status: "REGISTERED",
            registrationIds: [],
            createdAt: new Date().toISOString(),
          };
        }

        setShowAddDialog(false);
        showMessage(
          `Attendee ${attendee.firstName} ${attendee.lastName} created successfully`,
          "success"
        );

        // Manually add the new attendee to the state for immediate feedback
        setAttendees((prevAttendees) => {
          // Make sure we have the attendee object
          if (attendee) {
            // Check if attendee already exists in the list
            const exists = prevAttendees.some((a) => a.id === attendee.id);
            if (!exists) {
              console.log("Adding new attendee to the list:", attendee);
              // Add the new attendee to the beginning of the list
              return [attendee, ...prevAttendees];
            }
          }
          return prevAttendees;
        });
      } else if (showEditDialog && currentAttendee) {
        // Update existing attendee
        console.log("Updating attendee with data:", formData);

        // Ensure we have the ID from the currentAttendee
        const updateData = {
          ...formData,
          id: currentAttendee.id, // Ensure ID is preserved
        };

        try {
          attendee = await updateAttendee(currentAttendee.id, updateData);
          console.log("Updated attendee:", attendee);

          if (!attendee && process.env.NODE_ENV === "development") {
            console.warn("Using mock update for development");
            attendee = {
              ...currentAttendee,
              ...updateData,
              updatedAt: new Date().toISOString(),
            };
          }
        } catch (updateError) {
          console.error("Error during attendee update:", updateError);

          // Only throw in non-development environment
          if (process.env.NODE_ENV !== "development") {
            throw updateError;
          } else {
            // Use mock update in development
            attendee = {
              ...currentAttendee,
              ...updateData,
              updatedAt: new Date().toISOString(),
            };
          }
        }

        setShowEditDialog(false);
        showMessage(
          `Attendee ${attendee.firstName} ${attendee.lastName} updated successfully`,
          "success"
        );

        // Update attendee in the state for immediate feedback
        setAttendees((prevAttendees) => {
          const updatedAttendees = prevAttendees.map((a) =>
            a.id === currentAttendee.id ? { ...a, ...updateData } : a
          );
          console.log("Updated attendees list:", updatedAttendees);
          return updatedAttendees;
        });
      }

      // Refresh the attendee list from the backend - remove timeout as it might be causing issues
      loadAttendees(currentPage, statusFilter, searchTerm);
    } catch (err) {
      console.error("Error saving attendee:", err);
      setError("Failed to save attendee. Please try again.");
      showMessage("Failed to save attendee. Please try again.", "error");

      // In development mode, still close the dialog and refresh with mock data
      if (process.env.NODE_ENV === "development") {
        setShowAddDialog(false);
        setShowEditDialog(false);
        loadAttendees(currentPage, statusFilter, searchTerm);
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!currentAttendee || !currentAttendee.id) {
      console.error("Cannot delete: No attendee selected or invalid ID");
      setError("Cannot delete: No valid attendee selected");
      showMessage("Cannot delete: No valid attendee selected", "error");
      return;
    }

    setFormSubmitting(true);
    console.log(`Deleting attendee: ${currentAttendee.id}`);

    try {
      try {
        const result = await deleteAttendee(currentAttendee.id);
        console.log(
          `Attendee ${currentAttendee.id} deleted successfully:`,
          result
        );

        if (!result && process.env.NODE_ENV === "development") {
          console.warn("Using mock deletion for development");
        }
      } catch (deleteError) {
        console.error("Error during attendee deletion:", deleteError);

        // Only throw the error if we're not in development mode
        if (process.env.NODE_ENV !== "development") {
          throw deleteError;
        }
      }

      setShowDeleteDialog(false);
      showMessage(
        `Attendee ${currentAttendee.firstName} ${currentAttendee.lastName} deleted successfully`,
        "success"
      );

      // Immediately update UI to remove the deleted attendee
      setAttendees((prevAttendees) => {
        const filteredAttendees = prevAttendees.filter(
          (a) => a.id !== currentAttendee.id
        );
        console.log("Filtered attendees after delete:", filteredAttendees);
        return filteredAttendees;
      });

      // Ensure the attendee list is updated
      loadAttendees(currentPage, statusFilter, searchTerm);
    } catch (err) {
      console.error("Error deleting attendee:", err);
      setError("Failed to delete attendee. Please try again.");
      showMessage("Failed to delete attendee. Please try again.", "error");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleFilterChange = (newStatusFilter) => {
    console.log(`Changing status filter to: ${newStatusFilter}`);
    setStatusFilter(newStatusFilter);
    // loadAttendees is called via useEffect when statusFilter changes
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Attendee Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          View, add, and manage attendees for your events
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={6} md={8}>
            <SearchContainer>
              <TextField
                fullWidth
                placeholder="Search attendees by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClearSearch} size="small">
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                size="medium"
                sx={{ flexGrow: 1 }}
              />
              <Button
                variant="outlined"
                onClick={handleSearch}
                disabled={loading}
                sx={{ height: 56, minWidth: 100 }}
              >
                Search
              </Button>
            </SearchContainer>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: { xs: "flex-start", sm: "flex-end" },
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{ mb: { xs: 1, sm: 0 } }}
              >
                Filters
              </Button>

              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleRefresh}
                disabled={loading}
                sx={{ mb: { xs: 1, sm: 0 } }}
              >
                Refresh
              </Button>

              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={handleAddAttendee}
              >
                Add Attendee
              </Button>
            </Box>
          </Grid>

          {showFilters && (
            <Grid item xs={12}>
              <FiltersContainer>
                <FormControl sx={{ minWidth: 180 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => handleFilterChange(e.target.value)}
                  >
                    <MenuItem value="ALL">All Statuses</MenuItem>
                    <MenuItem value="REGISTERED">Registered</MenuItem>
                    <MenuItem value="CHECKED_IN">Checked In</MenuItem>
                    <MenuItem value="CANCELLED">Cancelled</MenuItem>
                    <MenuItem value="NO_SHOW">No Show</MenuItem>
                    <MenuItem value="WAITLISTED">Waitlisted</MenuItem>
                  </Select>
                </FormControl>

                {statusFilter !== "ALL" && (
                  <Chip
                    label={`Status: ${statusFilter}`}
                    onDelete={() => handleFilterChange("ALL")}
                    color="primary"
                    variant="outlined"
                    sx={{ ml: 1 }}
                  />
                )}
              </FiltersContainer>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {loading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton
                variant="rectangular"
                height={220}
                sx={{ borderRadius: 1 }}
              />
            </Grid>
          ))
        ) : attendees.length === 0 ? (
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                bgcolor: "background.default",
              }}
            >
              <Box mb={2}>
                <SearchOff
                  sx={{ fontSize: 64, color: "text.secondary", opacity: 0.5 }}
                />
              </Box>
              <Typography variant="h6">No attendees found</Typography>
              <Typography color="text.secondary" gutterBottom>
                {searchTerm
                  ? "Try a different search term or clear filters"
                  : statusFilter !== "ALL"
                  ? `No attendees with status: ${statusFilter}`
                  : "Start by adding your first attendee"}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddAttendee}
                sx={{ mt: 2 }}
              >
                Add Attendee
              </Button>
            </Paper>
          </Grid>
        ) : (
          attendees.map((attendee) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={attendee.id}
              sx={{ display: "flex" }}
            >
              <AttendeeCard
                attendee={attendee}
                onView={handleViewAttendee}
                onEdit={() => handleEditAttendee(attendee)}
                onDelete={() => handleDeleteAttendee(attendee)}
              />
            </Grid>
          ))
        )}
      </Grid>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4} mb={2}>
          <Pagination
            count={totalPages}
            page={currentPage + 1}
            onChange={handlePageChange}
            color="primary"
            disabled={loading}
            size="large"
          />
        </Box>
      )}

      {/* Add Attendee Dialog */}
      <Dialog
        open={showAddDialog}
        onClose={() => !formSubmitting && setShowAddDialog(false)}
        maxWidth="md"
        fullWidth
        disableRestoreFocus
        disableEnforceFocus
        keepMounted
        PaperProps={{
          sx: {
            maxHeight: "90vh",
            overflowY: "auto",
          },
        }}
      >
        <DialogTitle>Add New Attendee</DialogTitle>
        <DialogContent dividers>
          <Box p={2}>
            <AttendeeForm
              initialValues={null}
              onSubmit={(formData) => {
                console.log("Add dialog form submitted with data:", formData);
                handleFormSubmit(formData);
              }}
              isLoading={formSubmitting}
              submitButtonText="Create Attendee"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setShowAddDialog(false)}
            disabled={formSubmitting}
            color="inherit"
            variant="outlined"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Attendee Dialog */}
      <Dialog
        open={showEditDialog}
        onClose={() => !formSubmitting && setShowEditDialog(false)}
        maxWidth="md"
        fullWidth
        disableRestoreFocus
        disableEnforceFocus
        keepMounted
        PaperProps={{
          sx: {
            maxHeight: "90vh",
            overflowY: "auto",
          },
        }}
      >
        <DialogTitle>
          Edit Attendee: {currentAttendee?.firstName}{" "}
          {currentAttendee?.lastName}
        </DialogTitle>
        <DialogContent dividers>
          {currentAttendee ? (
            <Box p={2}>
              <AttendeeForm
                initialValues={currentAttendee}
                onSubmit={(formData) => {
                  console.log(
                    "Edit dialog form submitted with data:",
                    formData
                  );
                  handleFormSubmit(formData);
                }}
                isLoading={formSubmitting}
                submitButtonText="Update Attendee"
                isEdit={true}
              />
            </Box>
          ) : (
            <Box p={4} textAlign="center">
              <Typography color="error">
                No attendee data available. Please try again.
              </Typography>
              <Button
                onClick={() => setShowEditDialog(false)}
                sx={{ mt: 2 }}
                variant="outlined"
              >
                Close
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setShowEditDialog(false)}
            disabled={formSubmitting}
            color="inherit"
            variant="outlined"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => !formSubmitting && setShowDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          {currentAttendee ? (
            <DialogContentText>
              Are you sure you want to delete the attendee{" "}
              <strong>
                {currentAttendee.firstName} {currentAttendee.lastName}
              </strong>
              ? This action cannot be undone.
            </DialogContentText>
          ) : (
            <DialogContentText color="error">
              No attendee selected for deletion.
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setShowDeleteDialog(false)}
            disabled={formSubmitting}
            color="inherit"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            disabled={formSubmitting || !currentAttendee}
            variant="contained"
          >
            {formSubmitting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AttendeesPage;
