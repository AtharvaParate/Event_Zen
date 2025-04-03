import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Divider,
  Card,
  CardContent,
  CardActions,
  LinearProgress,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  DialogContentText,
  InputAdornment,
  Pagination,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  AttachMoney as MoneyIcon,
  ShowChart as ChartIcon,
} from "@mui/icons-material";
import {
  fetchBudgets,
  deleteBudget,
  createBudget,
  updateBudget,
  getAllBudgets,
  deleteBudgetWithRetry,
} from "../api/budgetApi";
import { fetchEvents } from "../api/eventApi";
import BudgetForm from "../components/BudgetForm";
import { API_CONFIG } from "../config/apiConfig";
import ErrorDisplay from "../components/ErrorDisplay";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { formatCurrency } from "../utils/formatters";

// Create a BudgetCard component for displaying budget information
const BudgetCard = ({ budget, event, onEdit, onView, onDelete }) => {
  // Calculate budget progress
  const calculateBudgetProgress = (budget) => {
    if (budget.totalBudget <= 0) return 0;
    return Math.min(100, (budget.currentExpenses / budget.totalBudget) * 100);
  };

  // Get appropriate color for progress bar based on percentage
  const getProgressColor = (progress) => {
    if (progress < 50) return "success";
    if (progress < 80) return "warning";
    return "error";
  };

  // Get event name or placeholder
  const getEventName = () => {
    return event ? event.title : "No associated event";
  };

  return (
    <Card
      elevation={3}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
          transition: "all 0.3s",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="div" gutterBottom noWrap>
          {budget.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Event: {getEventName()}
        </Typography>

        <Box sx={{ mt: 2, mb: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 0.5,
            }}
          >
            <Typography variant="body2">Budget Progress:</Typography>
            <Typography variant="body2">
              {calculateBudgetProgress(budget).toFixed(0)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={calculateBudgetProgress(budget)}
            color={getProgressColor(calculateBudgetProgress(budget))}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Total Budget:</Typography>
            <Typography variant="h6">
              {formatCurrency(budget.totalBudget)}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">Expenses:</Typography>
            <Typography
              variant="h6"
              color={
                budget.currentExpenses > budget.totalBudget
                  ? "error.main"
                  : "text.primary"
              }
            >
              {formatCurrency(budget.currentExpenses)}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">Income:</Typography>
          <Typography variant="h6" color="success.main">
            {formatCurrency(budget.currentIncome)}
          </Typography>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">Categories:</Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0.5,
              mt: 0.5,
            }}
          >
            {budget.categories &&
              budget.categories.map((category, index) => (
                <Chip
                  key={index}
                  label={category}
                  size="small"
                  color="primary"
                  variant="outlined"
                  sx={{ marginRight: 0.5, marginBottom: 0.5 }}
                />
              ))}
          </Box>
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button size="small" onClick={onView} startIcon={<ChartIcon />}>
          View Details
        </Button>
        <Button
          size="small"
          color="primary"
          onClick={onEdit}
          startIcon={<EditIcon />}
        >
          Edit
        </Button>
        <Button
          size="small"
          color="error"
          onClick={onDelete}
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

const BudgetsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [budgets, setBudgets] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
    open: false,
    budgetId: null,
  });
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [deletedBudgetIds, setDeletedBudgetIds] = useState([]);
  const [budgetToEdit, setBudgetToEdit] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Create a ref to track the last fetch time (outside the callback)
  const lastFetchTimeRef = useRef(0);

  // Load budgets and events - wrapped in useCallback to use as dependency in useEffect
  const loadData = useCallback(async () => {
    // If we already have budgets data and we're not at the initial load, use a less intrusive loading indicator
    const hasExistingData = budgets.length > 0;
    if (hasExistingData) {
      // Use a lighter loading state for subsequent data fetches
      setLoading(false); // Don't show full loading spinner if we have data
    } else {
      setLoading(true);
    }

    try {
      // Determine if we should force refresh based on how much time has passed since last fetch
      const now = Date.now();
      const forceRefresh = now - lastFetchTimeRef.current > 300000; // Force refresh if it's been over 5 minutes

      // Only log at debug level to reduce console noise
      console.debug("BudgetsPage: Fetching budgets...");

      // Use the cache-aware fetchBudgets function with current parameters
      const budgetsData = await fetchBudgets(page, 10, forceRefresh);
      lastFetchTimeRef.current = now;

      if (!budgetsData) {
        console.error("BudgetsPage: budgetsData is null or undefined");
        setError("Failed to load budgets. The response was empty.");
        return;
      }

      // Process the budget data
      let processedBudgets = [];
      if (budgetsData.content) {
        processedBudgets = budgetsData.content;
        setTotalPages(budgetsData.totalPages || 1);
      } else if (Array.isArray(budgetsData)) {
        processedBudgets = budgetsData;
        setTotalPages(1);
      } else {
        console.error("BudgetsPage: Unexpected data format:", budgetsData);
        setError("Failed to load budgets. Unexpected data format received.");
        setBudgets([]);
        return;
      }

      // Filter out deleted budgets
      const filteredBudgets = processedBudgets.filter(
        (budget) => !deletedBudgetIds.includes(budget.id)
      );

      // Only update state if data has actually changed
      if (JSON.stringify(filteredBudgets) !== JSON.stringify(budgets)) {
        setBudgets(filteredBudgets);
      }

      // Only fetch events if we don't already have them or if forcing refresh
      if (events.length === 0 || forceRefresh) {
        try {
          // Fetch events in the background
          fetchEvents()
            .then((eventsData) => {
              setEvents(eventsData.content || eventsData || []);
            })
            .catch((error) => {
              console.error("Background events fetch error:", error);
            });
        } catch (eventsErr) {
          console.error("BudgetsPage: Error loading events:", eventsErr);
          // Continue even if events fail to load
        }
      }

      setError(null);
    } catch (err) {
      console.error("BudgetsPage: Error loading budgets:", err);
      setError(
        `Failed to load budgets. Error: ${err.message || "Unknown error"}`
      );

      // Don't clear existing budgets on error if we have data
      if (!hasExistingData) {
        setBudgets([]);
      }
    } finally {
      setLoading(false);
    }
  }, [page, deletedBudgetIds, budgets, events.length]);

  // Load data on component mount or when page changes
  useEffect(() => {
    loadData();
  }, [page, loadData]);

  // Check for navigation state (e.g., coming back after deletion from detail page)
  useEffect(() => {
    if (location.state) {
      if (location.state.deletedBudget) {
        // Show success message for deletion from detail page
        setSnackbar({
          open: true,
          message: location.state.message || "Budget deleted successfully",
          severity: "success",
        });

        // Add the deleted budget ID to our tracking if it was provided
        if (location.state.deletedBudgetId) {
          setDeletedBudgetIds((prev) => [
            ...prev,
            location.state.deletedBudgetId,
          ]);
        }

        // Clear the navigation state to prevent showing the message again on refresh
        navigate(location.pathname, { replace: true });

        // Refresh data to ensure we're showing the latest
        loadData();
      } else if (location.state.error) {
        // Show error message from detail page
        setSnackbar({
          open: true,
          message: location.state.message || "An error occurred",
          severity: "error",
        });

        // Clear the navigation state
        navigate(location.pathname, { replace: true });
      }
    }
  }, [location, navigate, loadData]);

  // Handle refresh - updated to respect deleted budget IDs
  const handleRefresh = async () => {
    // Use a more specific loading indicator for refresh
    setSnackbar({
      open: true,
      message: "Refreshing budgets...",
      severity: "info",
    });

    try {
      // Force a fresh fetch by bypassing cache
      const budgetsData = await fetchBudgets(page, 10, true);

      let refreshedBudgets = [];
      if (budgetsData.content) {
        refreshedBudgets = budgetsData.content;
        setTotalPages(budgetsData.totalPages || 1);
      } else if (Array.isArray(budgetsData)) {
        refreshedBudgets = budgetsData;
        setTotalPages(1);
      }

      // Filter out deleted budgets
      const filteredBudgets = refreshedBudgets.filter(
        (budget) => !deletedBudgetIds.includes(budget.id)
      );

      setBudgets(filteredBudgets);

      // Also refresh events data but don't wait for it
      fetchEvents()
        .then((eventsData) => {
          setEvents(eventsData.content || eventsData || []);
        })
        .catch((error) => {
          console.error("Error refreshing events:", error);
        });

      setSnackbar({
        open: true,
        message: "Budgets refreshed successfully",
        severity: "success",
      });
      setError(null);
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError("Failed to refresh budgets. Please try again.");
      setSnackbar({
        open: true,
        message: "Failed to refresh budgets",
        severity: "error",
      });
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value - 1); // MUI Pagination is 1-indexed, our API is 0-indexed
  };

  // Open budget form dialog
  const handleOpenDialog = () => {
    setBudgetToEdit(null); // Reset edit state
    setOpenDialog(true);
  };

  // Close budget form dialog
  const handleCloseDialog = () => {
    setBudgetToEdit(null);
    setOpenDialog(false);
  };

  // Handle form submission (both create and edit)
  const handleSaveBudget = async (budgetData) => {
    try {
      if (budgetToEdit) {
        // Update existing budget
        await updateBudget(budgetToEdit.id, budgetData);
        setSnackbar({
          open: true,
          message: "Budget updated successfully",
          severity: "success",
        });
      } else {
        // Create new budget
        await createBudget(budgetData);
        setSnackbar({
          open: true,
          message: "Budget created successfully",
          severity: "success",
        });
      }
      handleCloseDialog();
      loadData(); // Refresh the list
    } catch (error) {
      console.error("Error saving budget:", error);
      setSnackbar({
        open: true,
        message: `Failed to save budget: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Handle edit button click
  const handleEditBudget = (id) => {
    const budgetToEdit = budgets.find((b) => b.id === id);
    if (budgetToEdit) {
      setBudgetToEdit(budgetToEdit);
      setOpenDialog(true);
    }
  };

  // Handle view details button click
  const handleViewBudget = (id) => {
    navigate(`/budgets/${id}`);
  };

  // Open delete confirmation dialog
  const handleConfirmDeleteBudget = (id) => {
    setDeleteConfirmDialog({ open: true, budgetId: id });
  };

  // Close snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Get event name from ID
  const getEventName = (eventId) => {
    if (!eventId) return "No Event";
    const event = events.find((event) => event.id === eventId);
    return event
      ? event.name || event.title || `Event ${event.id}`
      : "Unknown Event";
  };

  // Calculate budget progress percentage
  const calculateBudgetProgress = (budget) => {
    if (budget.totalBudget <= 0) return 0;
    return Math.min(100, (budget.currentExpenses / budget.totalBudget) * 100);
  };

  // Get progress color based on percentage
  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "error";
    if (percentage >= 75) return "warning";
    return "primary";
  };

  // Filter budgets based on search term
  const filteredBudgets = budgets.filter(
    (budget) =>
      budget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (budget.eventId &&
        getEventName(budget.eventId)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  // Modify the component to include a virtualized list for better rendering performance with many budgets
  const renderBudgetList = () => {
    // Show the existing budget items even while loading more
    if (budgets.length === 0) {
      if (loading) {
        return (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        );
      } else if (error) {
        return (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        );
      } else {
        return (
          <Typography variant="body1" sx={{ textAlign: "center", my: 4 }}>
            No budgets found. Create a new budget to get started.
          </Typography>
        );
      }
    }

    // Show budgets with a lighter loading indicator when fetching more data
    return (
      <>
        {loading && <LinearProgress sx={{ mb: 2 }} />}
        <Grid container spacing={3}>
          {budgets.map((budget) => (
            <Grid item xs={12} sm={6} md={4} key={budget.id}>
              <BudgetCard
                budget={budget}
                event={events.find((e) => e.id === budget.eventId)}
                onEdit={() => handleEditBudget(budget.id)}
                onView={() => handleViewBudget(budget.id)}
                onDelete={() => handleConfirmDeleteBudget(budget.id)}
              />
            </Grid>
          ))}
        </Grid>
      </>
    );
  };

  // Handle delete budget
  const handleDeleteBudget = async (budgetId) => {
    if (!budgetId) return;

    console.log(`Starting deletion process for budget ID: ${budgetId}`);
    setDeleteInProgress(true);

    try {
      // First remove the budget from UI immediately for better UX
      setBudgets((prevBudgets) =>
        prevBudgets.filter((budget) => budget.id !== budgetId)
      );

      // Also add to our deleted IDs tracking to prevent reappearance on refresh
      setDeletedBudgetIds((prev) => [...prev, budgetId]);

      // Then call the API
      const result = await deleteBudgetWithRetry(budgetId);
      console.log("Delete budget API response:", result);

      setSnackbar({
        open: true,
        message: result.message || "Budget deleted successfully",
        severity: "success",
      });

      // No need to call handleRefresh since it might bring the budget back
      // due to eventual consistency in the backend
      // We rely on our deletedBudgetIds filtering
    } catch (err) {
      console.error("Error deleting budget:", err);

      // Handle the error based on its type
      let errorMessage = "Failed to delete budget";
      let shouldRestoreBudget = true;

      if (err.response) {
        const status = err.response.status;
        if (status === 403 || status === 401) {
          errorMessage = "You don't have permission to delete this budget";
        } else if (status === 404) {
          errorMessage = "Budget not found - it may have been already deleted";
          shouldRestoreBudget = false; // No need to restore if it's already gone
        } else if (status >= 500) {
          errorMessage = "Server error occurred while deleting budget";
        }
      } else if (err.request) {
        errorMessage = "Network error - please check your connection";
      } else if (err.message) {
        errorMessage = `Error: ${err.message}`;
      }

      // Remove from deleted IDs if we need to restore it (only for non-404 errors)
      if (shouldRestoreBudget) {
        setDeletedBudgetIds((prev) => prev.filter((id) => id !== budgetId));

        // Add the budget back to the list if deletion failed
        loadData(); // Reload budgets to restore the one we optimistically removed
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setDeleteInProgress(false);
      setDeleteConfirmDialog({ open: false, budgetId: null });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <MoneyIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
          Budget Management
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{ mr: 1 }}
          >
            Create Budget
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Search Budgets"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Display error message */}
        {error && !loading && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {/* Budget cards */}
        {renderBudgetList()}

        {/* Pagination controls */}
        {!loading && budgets.length > 0 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Paper>

      {/* Add Budget Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
        <DialogTitle>
          {budgetToEdit ? "Edit Budget" : "Create New Budget"}
        </DialogTitle>
        <DialogContent>
          <BudgetForm
            budget={budgetToEdit}
            events={events}
            onSave={handleSaveBudget}
            onCancel={handleCloseDialog}
            mode={budgetToEdit ? "edit" : "create"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteConfirmDialog.open}
        title="Delete Budget"
        content="Are you sure you want to delete this budget? This action cannot be undone."
        onConfirm={() => handleDeleteBudget(deleteConfirmDialog.budgetId)}
        onCancel={() => setDeleteConfirmDialog({ open: false, budgetId: null })}
        isLoading={deleteInProgress}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BudgetsPage;
