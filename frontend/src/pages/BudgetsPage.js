import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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

  // Load budgets and events - wrapped in useCallback to use as dependency in useEffect
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      console.log("BudgetsPage: Starting to fetch budgets...");
      console.log("BudgetsPage: Current API config:", API_CONFIG);
      console.log(
        "BudgetsPage: USE_MOCK_DATA setting:",
        API_CONFIG.USE_MOCK_DATA
      );

      // Load budgets with pagination
      const budgetsData = await fetchBudgets(page, 10);
      console.log("BudgetsPage: Received budget data:", budgetsData);

      if (!budgetsData) {
        console.error("BudgetsPage: budgetsData is null or undefined");
        setError("Failed to load budgets. The response was empty.");
        setBudgets([]);
        setLoading(false);
        return;
      }

      // Check if budgetsData has the expected structure
      if (budgetsData.content) {
        console.log(
          "BudgetsPage: Setting budgets from budgetsData.content:",
          budgetsData.content
        );
        setBudgets(budgetsData.content);
        setTotalPages(budgetsData.totalPages || 1);
      } else if (Array.isArray(budgetsData)) {
        console.log(
          "BudgetsPage: Setting budgets directly from array:",
          budgetsData
        );
        setBudgets(budgetsData);
        setTotalPages(1);
      } else {
        console.error("BudgetsPage: Unexpected data format:", budgetsData);
        setError("Failed to load budgets. Unexpected data format received.");
        setBudgets([]);
      }

      try {
        // Load events for reference
        console.log("BudgetsPage: Fetching events...");
        const eventsData = await fetchEvents();
        console.log("BudgetsPage: Received events data:", eventsData);
        setEvents(eventsData.content || eventsData || []);
      } catch (eventsErr) {
        console.error("BudgetsPage: Error loading events:", eventsErr);
        // Still continue even if events fail to load
        setEvents([]);
      }

      setError(null);
    } catch (err) {
      console.error("BudgetsPage: Error loading budgets:", err);
      console.error("BudgetsPage: Error details:", {
        message: err.message,
        stack: err.stack,
        response: err.response
          ? {
              status: err.response.status,
              statusText: err.response.statusText,
              data: err.response.data,
            }
          : "No response",
      });
      setError(
        `Failed to load budgets. Error: ${err.message || "Unknown error"}`
      );
      setBudgets([]);
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Load data on component mount or when page changes
  useEffect(() => {
    loadData();
  }, [page, loadData]);

  // Handle refresh
  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Load budgets with pagination
      const budgetsData = await fetchBudgets(page, 10);
      setBudgets(budgetsData.content || []);
      setTotalPages(budgetsData.totalPages || 1);

      // Also refresh events data
      const eventsData = await fetchEvents();
      setEvents(eventsData.content || []);

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
    } finally {
      setLoading(false);
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

  // Handle delete budget
  const handleDeleteBudget = async () => {
    if (!deleteConfirmDialog.budgetId) return;

    setLoading(true);
    try {
      await deleteBudget(deleteConfirmDialog.budgetId);
      setSnackbar({
        open: true,
        message: "Budget deleted successfully",
        severity: "success",
      });
      handleRefresh();
    } catch (err) {
      console.error("Error deleting budget:", err);
      setSnackbar({
        open: true,
        message: "Failed to delete budget",
        severity: "error",
      });
    } finally {
      setLoading(false);
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
      {!loading && !error && (
        <Grid container spacing={3}>
          {filteredBudgets.length > 0 ? (
            filteredBudgets.map((budget) => (
              <Grid item xs={12} md={6} lg={4} key={budget.id}>
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
                    <Typography
                      variant="h5"
                      component="div"
                      gutterBottom
                      noWrap
                    >
                      {budget.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Event: {getEventName(budget.eventId)}
                    </Typography>

                    <Box sx={{ mt: 2, mb: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="body2">
                          Budget Progress:
                        </Typography>
                        <Typography variant="body2">
                          {calculateBudgetProgress(budget).toFixed(0)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={calculateBudgetProgress(budget)}
                        color={getProgressColor(
                          calculateBudgetProgress(budget)
                        )}
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2">
                          Total Budget:
                        </Typography>
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
                    <Button
                      size="small"
                      onClick={() => handleViewBudget(budget.id)}
                      startIcon={<ChartIcon />}
                    >
                      View Details
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleEditBudget(budget.id)}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteConfirm(budget.id)}
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h6" color="text.secondary">
                  {loading ? "Loading budgets..." : "No budgets found"}
                </Typography>
                {!loading && (
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<AddIcon />}
                    sx={{ mt: 2 }}
                    onClick={handleOpenDialog}
                  >
                    Create your first budget
                  </Button>
                )}
              </Paper>
            </Grid>
          )}
        </Grid>
      )}

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
        onClose={handleCloseDeleteConfirm}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this budget? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteBudget}
            autoFocus
          >
            Delete
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
