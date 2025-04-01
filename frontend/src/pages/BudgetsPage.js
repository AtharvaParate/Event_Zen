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
import { fetchBudgets, deleteBudget, createBudget } from "../api/budgetApi";
import { fetchEvents } from "../api/eventApi";
import BudgetForm from "../components/BudgetForm";
import { API_CONFIG } from "../config/apiConfig";
import ErrorDisplay from "../components/ErrorDisplay";

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
      const lastFetchTime = useRef(0);
      const now = Date.now();
      const forceRefresh = now - lastFetchTime.current > 300000; // Force refresh if it's been over 5 minutes

      // Only log at debug level to reduce console noise
      console.debug("BudgetsPage: Fetching budgets...");

      // Use the cache-aware fetchBudgets function with current parameters
      const budgetsData = await fetchBudgets(page, 10, forceRefresh);
      lastFetchTime.current = now;

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

  // Open budget form dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Close budget form dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // View budget details
  const handleViewBudget = (budgetId) => {
    navigate(`/budgets/${budgetId}`);
  };

  // Handle edit budget
  const handleEditBudget = (budgetId) => {
    navigate(`/budgets/edit/${budgetId}`);
  };

  // Open delete confirmation dialog
  const handleDeleteConfirm = (budgetId) => {
    setDeleteConfirmDialog({ open: true, budgetId });
  };

  // Close delete confirmation dialog
  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmDialog({ open: false, budgetId: null });
  };

  // Handle delete budget - update to add the deleted budget ID to our tracking array
  const handleDeleteBudget = async () => {
    if (!deleteConfirmDialog.budgetId) return;

    const budgetIdToDelete = deleteConfirmDialog.budgetId;
    console.log(`Starting deletion process for budget ID: ${budgetIdToDelete}`);

    setLoading(true);
    setDeleteInProgress(true);

    try {
      // First remove the budget from UI immediately for better UX
      setBudgets((prevBudgets) =>
        prevBudgets.filter((budget) => budget.id !== budgetIdToDelete)
      );

      // Also add to our deleted IDs tracking to prevent reappearance on refresh
      setDeletedBudgetIds((prev) => [...prev, budgetIdToDelete]);

      // Then call the API
      const result = await deleteBudget(budgetIdToDelete);
      console.log("Delete budget API response:", result);

      setSnackbar({
        open: true,
        message: result.message || "Budget deleted successfully",
        severity: "success",
      });

      // No need to filter budgets again since we did it optimistically

      // Refresh data in background after a short delay
      setTimeout(() => {
        // No need to call handleRefresh since it might bring the budget back
        // due to eventual consistency in the backend
        // We rely on our deletedBudgetIds filtering
      }, 1000);
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
        setDeletedBudgetIds((prev) =>
          prev.filter((id) => id !== budgetIdToDelete)
        );

        // Add the budget back to the list if deletion failed
        loadData(); // Reload budgets to restore the one we optimistically removed
      }

      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
      setDeleteInProgress(false);
      setDeleteConfirmDialog({ open: false, budgetId: null });
    }
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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

  // Handle saving a new budget
  const handleSaveBudget = async (budgetData) => {
    try {
      setLoading(true);
      await createBudget(budgetData);
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: "Budget created successfully",
        severity: "success",
      });
      handleRefresh();
    } catch (error) {
      console.error("Error creating budget:", error);
      setSnackbar({
        open: true,
        message: "Failed to create budget",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

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
                onDelete={() => handleDeleteConfirm(budget.id)}
              />
            </Grid>
          ))}
        </Grid>
      </>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Grid container spacing={3} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs>
          <Typography variant="h4" component="h1" gutterBottom>
            <MoneyIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
            Budget Management
          </Typography>
        </Grid>
        <Grid item>
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              size="small"
              placeholder="Search budgets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
            >
              Create Budget
            </Button>
            <IconButton color="primary" onClick={loadData} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Loading indicator */}
      {loading && <LinearProgress sx={{ mb: 3 }} />}

      {/* Error message */}
      {error && <ErrorDisplay message={error} onRetry={loadData} />}

      {/* Budget cards */}
      {!loading && !error && <Box sx={{ my: 2 }}>{renderBudgetList()}</Box>}

      {/* Pagination controls */}

      {/* Add Budget Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        disableRestoreFocus
      >
        <DialogTitle>Create New Budget</DialogTitle>
        <DialogContent dividers>
          <Box p={1}>
            <BudgetForm
              onSave={handleSaveBudget}
              onCancel={handleCloseDialog}
              mode="create"
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmDialog.open}
        onClose={!deleteInProgress ? handleCloseDeleteConfirm : undefined}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this budget? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteConfirm}
            disabled={deleteInProgress}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteBudget}
            color="error"
            autoFocus
            disabled={deleteInProgress}
            startIcon={deleteInProgress ? <CircularProgress size={20} /> : null}
          >
            {deleteInProgress ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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

export default BudgetsPage;
