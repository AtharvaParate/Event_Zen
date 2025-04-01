import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Box,
  Tabs,
  Tab,
  LinearProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  DialogContentText,
  CircularProgress,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  AddCircle as AddCircleIcon,
} from "@mui/icons-material";
import {
  fetchBudgetById,
  deleteBudget,
  fetchExpensesByBudgetId,
  fetchIncomesByBudgetId,
  createExpense,
  updateExpense,
  createIncome,
  updateIncome,
  updateBudget,
} from "../api/budgetApi";
import { fetchEvents } from "../api/eventApi";
import ExpenseList from "../components/ExpenseList";
import IncomeList from "../components/IncomeList";
import BudgetSummary from "../components/BudgetSummary";
import ExpenseForm from "../components/ExpenseForm";
import IncomeForm from "../components/IncomeForm";
import BudgetForm from "../components/BudgetForm";
import { API_CONFIG } from "../config/apiConfig";
import ErrorDisplay from "../components/ErrorDisplay";

// TabPanel component for tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`budget-tabpanel-${index}`}
      aria-labelledby={`budget-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const BudgetDetailPage = ({ edit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [budget, setBudget] = useState(null);
  const [event, setEvent] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(edit);
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const [redirectingAfterDelete, setRedirectingAfterDelete] = useState(false);

  // Load budget data - wrapped in useCallback to use as dependency in useEffect
  const loadBudgetData = useCallback(async () => {
    setLoading(true);
    try {
      console.log("BudgetDetailPage: Starting to fetch budget with ID:", id);
      console.log("BudgetDetailPage: API config:", API_CONFIG);

      // Fetch budget details
      const budgetData = await fetchBudgetById(id);
      console.log("BudgetDetailPage: Budget data received:", budgetData);
      setBudget(budgetData);

      // Fetch associated event
      if (budgetData.eventId) {
        try {
          console.log(
            "BudgetDetailPage: Fetching event with ID:",
            budgetData.eventId
          );
          const response = await fetchEvents();
          console.log("BudgetDetailPage: Events data received:", response);
          const eventData = response.content.find(
            (e) => e.id === budgetData.eventId
          );
          if (eventData) {
            console.log("BudgetDetailPage: Event found:", eventData);
            setEvent(eventData);
          } else {
            console.warn(
              "BudgetDetailPage: Event not found for ID:",
              budgetData.eventId
            );
          }
        } catch (error) {
          console.error("BudgetDetailPage: Error fetching event data:", error);
          // Continue execution even if event data can't be fetched
        }
      }

      // Fetch expenses for this budget - handle gracefully if endpoint is not implemented
      try {
        console.log("BudgetDetailPage: Fetching expenses for budget ID:", id);
        const expensesData = await fetchExpensesByBudgetId(id);
        console.log("BudgetDetailPage: Expenses data received:", expensesData);
        setExpenses(expensesData.content || []);
      } catch (error) {
        console.warn(
          "BudgetDetailPage: Error fetching expenses, may not be implemented yet:",
          error
        );
        // Set empty expenses to avoid errors
        setExpenses([]);
      }

      // Fetch income for this budget - handle gracefully if endpoint is not implemented
      try {
        console.log("BudgetDetailPage: Fetching incomes for budget ID:", id);
        const incomesData = await fetchIncomesByBudgetId(id);
        console.log("BudgetDetailPage: Incomes data received:", incomesData);
        setIncomes(incomesData.content || []);
      } catch (error) {
        console.warn(
          "BudgetDetailPage: Error fetching incomes, may not be implemented yet:",
          error
        );
        // Set empty incomes to avoid errors
        setIncomes([]);
      }

      // Clear any previous errors
      setError(null);
    } catch (err) {
      console.error("BudgetDetailPage: Error loading budget data:", err);
      console.error("BudgetDetailPage: Error details:", {
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
      setError("Failed to load budget details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Load budget data on component mount or when ID changes
  useEffect(() => {
    if (id) {
      loadBudgetData();
    }
  }, [id, loadBudgetData]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Navigate back to budgets list
  const handleBack = () => {
    navigate("/budgets");
  };

  // Go to edit page
  const handleEdit = () => {
    if (budget) {
      console.log("Opening edit dialog with budget:", budget);
      setEditDialogOpen(true);
    } else {
      setSnackbar({
        open: true,
        message: "Unable to edit budget: Budget data not loaded",
        severity: "error",
      });
    }
  };

  // Open delete confirmation dialog
  const handleDeleteConfirm = () => {
    setDeleteConfirmOpen(true);
  };

  // Handle budget deletion
  const handleDelete = async () => {
    if (!id) return;

    console.log(
      `Starting deletion process for budget ID: ${id} from detail page`
    );
    setLoading(true);
    setDeleteInProgress(true);

    try {
      // Call the API to delete the budget
      const result = await deleteBudget(id);
      console.log("Delete budget API response from detail page:", result);

      setSnackbar({
        open: true,
        message: result.message || "Budget deleted successfully",
        severity: "success",
      });

      // Set a flag to prevent further interactions while redirecting
      setRedirectingAfterDelete(true);

      // Redirect after a short delay to show the success message
      setTimeout(() => {
        navigate("/budgets", {
          state: {
            deletedBudget: true,
            deletedBudgetId: parseInt(id, 10),
            message: "Budget was successfully deleted",
          },
        });
      }, 1500);
    } catch (err) {
      console.error("Error deleting budget from detail page:", err);

      // Provide more specific error message based on the error
      let errorMessage = "Failed to delete budget. Please try again.";
      let shouldRedirect = false;
      let status = null;

      if (err.response) {
        // Server responded with an error
        status = err.response.status;
        if (status === 403 || status === 401) {
          errorMessage = "You don't have permission to delete this budget";
        } else if (status === 404) {
          errorMessage = "Budget not found - it may have been already deleted";
          shouldRedirect = true; // Redirect since the budget doesn't exist

          // Still pass the ID to mark it as deleted
          setTimeout(() => {
            navigate("/budgets", {
              state: {
                deletedBudget: true,
                deletedBudgetId: parseInt(id, 10),
                message: errorMessage,
              },
            });
          }, 2000);
        } else if (status >= 500) {
          errorMessage = "Server error occurred while deleting budget";
        }
      } else if (err.request) {
        // Network error
        errorMessage = "Network error - please check your connection";
      } else if (err.message) {
        // Other errors with message
        errorMessage = `Error: ${err.message}`;
      }

      setError(errorMessage);
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: "error",
      });

      // Redirect if the budget doesn't exist anymore
      if (shouldRedirect && status !== 404) {
        setTimeout(() => {
          navigate("/budgets", {
            state: {
              error: true,
              message: errorMessage,
            },
          });
        }, 2000);
      } else {
        // Only set loading to false if we're not redirecting
        setLoading(false);
      }
    } finally {
      setDeleteInProgress(false);
      setDeleteConfirmOpen(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Calculate budget progress
  const calculateBudgetProgress = () => {
    if (!budget || budget.totalBudget <= 0) return 0;
    return Math.min(100, (budget.currentExpenses / budget.totalBudget) * 100);
  };

  // Get progress color
  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "error";
    if (percentage >= 75) return "warning";
    return "primary";
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Add new expense
  const handleAddExpense = () => {
    setEditItem(null);
    setExpenseDialogOpen(true);
  };

  const handleEditExpense = (expense) => {
    setEditItem(expense);
    setExpenseDialogOpen(true);
  };

  const handleSaveExpense = async (expenseData) => {
    try {
      if (editItem) {
        // Update existing expense
        await updateExpense(editItem.id, expenseData);
        setSnackbar({
          open: true,
          message: "Expense updated successfully",
          severity: "success",
        });
      } else {
        // Create new expense
        await createExpense(expenseData);
        setSnackbar({
          open: true,
          message: "Expense added successfully",
          severity: "success",
        });
      }
      setExpenseDialogOpen(false);

      // Reload budget and expense data
      const budgetData = await fetchBudgetById(id);
      setBudget(budgetData);

      const expensesData = await fetchExpensesByBudgetId(id);
      setExpenses(expensesData.content || []);
    } catch (err) {
      console.error("Error saving expense:", err);
      setSnackbar({
        open: true,
        message: "Failed to save expense",
        severity: "error",
      });
    }
  };

  // Add new income
  const handleAddIncome = () => {
    setEditItem(null);
    setIncomeDialogOpen(true);
  };

  const handleEditIncome = (income) => {
    setEditItem(income);
    setIncomeDialogOpen(true);
  };

  const handleSaveIncome = async (incomeData) => {
    try {
      if (editItem) {
        // Update existing income
        await updateIncome(editItem.id, incomeData);
        setSnackbar({
          open: true,
          message: "Income updated successfully",
          severity: "success",
        });
      } else {
        // Create new income
        await createIncome(incomeData);
        setSnackbar({
          open: true,
          message: "Income added successfully",
          severity: "success",
        });
      }
      setIncomeDialogOpen(false);

      // Reload budget and income data
      const budgetData = await fetchBudgetById(id);
      setBudget(budgetData);

      const incomesData = await fetchIncomesByBudgetId(id);
      setIncomes(incomesData.content || []);
    } catch (err) {
      console.error("Error saving income:", err);
      setSnackbar({
        open: true,
        message: "Failed to save income",
        severity: "error",
      });
    }
  };

  // Handle save budget updates
  const handleSaveBudget = async (budgetData) => {
    setLoading(true);
    try {
      console.log("Updating budget with data:", budgetData);
      await updateBudget(id, budgetData);
      setSnackbar({
        open: true,
        message: "Budget updated successfully",
        severity: "success",
      });
      setEditDialogOpen(false);

      // Reload budget data
      const updatedBudget = await fetchBudgetById(id);
      setBudget(updatedBudget);
    } catch (err) {
      console.error("Error updating budget:", err);
      setSnackbar({
        open: true,
        message: "Failed to update budget: " + (err.message || "Unknown error"),
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Return loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Loading Budget Details...
          </Typography>
          <LinearProgress />
        </Paper>
      </Container>
    );
  }

  // Return error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <ErrorDisplay
          message={error}
          onRetry={loadBudgetData}
          fullPage={true}
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header with back button */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
        <IconButton
          onClick={handleBack}
          color="primary"
          sx={{ mr: 1 }}
          aria-label="back to budgets"
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          {budget ? budget.name : "Budget Details"}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            disabled={loading}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteConfirm}
            disabled={loading}
          >
            Delete
          </Button>
        </Box>
      </Box>

      {budget && (
        <>
          {/* Budget Summary Card */}
          <Paper elevation={3} sx={{ mb: 3, p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Budget Overview
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Event: {event ? event.name : "Unknown Event"}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Status:{" "}
                  <Chip
                    label={budget.status}
                    color={budget.status === "ACTIVE" ? "success" : "default"}
                    size="small"
                  />
                </Typography>

                {budget.notes && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Notes:</Typography>
                    <Typography variant="body2">{budget.notes}</Typography>
                  </Box>
                )}

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
                          variant="outlined"
                        />
                      ))}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Budget Progress:
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                    <Box sx={{ flexGrow: 1, mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={calculateBudgetProgress()}
                        color={getProgressColor(calculateBudgetProgress())}
                        sx={{ height: 10, borderRadius: 5 }}
                      />
                    </Box>
                    <Typography variant="body2">
                      {calculateBudgetProgress().toFixed(0)}%
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2">Total Budget:</Typography>
                    <Typography variant="h6">
                      {formatCurrency(budget.totalBudget)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2">Total Expenses:</Typography>
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
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2">Total Income:</Typography>
                    <Typography variant="h6" color="success.main">
                      {formatCurrency(budget.currentIncome)}
                    </Typography>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Balance:</Typography>
                  <Typography
                    variant="h5"
                    color={
                      budget.currentIncome - budget.currentExpenses >= 0
                        ? "success.main"
                        : "error.main"
                    }
                  >
                    {formatCurrency(
                      budget.currentIncome - budget.currentExpenses
                    )}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Tabs for Expenses, Income, and Summary */}
          <Paper elevation={2}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="budget details tabs"
                variant="fullWidth"
              >
                <Tab
                  icon={<ReceiptIcon />}
                  iconPosition="start"
                  label="Expenses"
                  id="budget-tab-0"
                  aria-controls="budget-tabpanel-0"
                />
                <Tab
                  icon={<MoneyIcon />}
                  iconPosition="start"
                  label="Income"
                  id="budget-tab-1"
                  aria-controls="budget-tabpanel-1"
                />
                <Tab
                  label="Summary"
                  id="budget-tab-2"
                  aria-controls="budget-tabpanel-2"
                />
              </Tabs>
            </Box>

            {/* Expenses Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleIcon />}
                  onClick={handleAddExpense}
                >
                  Add Expense
                </Button>
              </Box>
              <ExpenseList
                expenses={expenses}
                onRefresh={() =>
                  fetchExpensesByBudgetId(id).then((data) =>
                    setExpenses(data.content || [])
                  )
                }
                onEdit={handleEditExpense}
                onAdd={handleAddExpense}
                loading={loading}
                budgetId={id}
              />
            </TabPanel>

            {/* Income Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleIcon />}
                  onClick={handleAddIncome}
                >
                  Add Income
                </Button>
              </Box>
              <IncomeList
                incomes={incomes}
                onRefresh={() =>
                  fetchIncomesByBudgetId(id).then((data) =>
                    setIncomes(data.content || [])
                  )
                }
                onEdit={handleEditIncome}
                onAdd={handleAddIncome}
                loading={loading}
                budgetId={id}
              />
            </TabPanel>

            {/* Summary Tab */}
            <TabPanel value={tabValue} index={2}>
              <BudgetSummary
                budget={budget}
                expenses={expenses}
                incomes={incomes}
              />
            </TabPanel>
          </Paper>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={
          !deleteInProgress ? () => setDeleteConfirmOpen(false) : undefined
        }
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">Delete Budget</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this budget? This action cannot be
            undone. All associated expenses and income records will also be
            deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteConfirmOpen(false)}
            disabled={deleteInProgress || redirectingAfterDelete}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteInProgress || redirectingAfterDelete}
            startIcon={
              deleteInProgress ? <CircularProgress size={20} /> : <DeleteIcon />
            }
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

      {/* Add/Edit Expense Dialog */}
      <Dialog
        open={expenseDialogOpen}
        onClose={() => setExpenseDialogOpen(false)}
        fullWidth
        maxWidth="md"
        disableRestoreFocus
      >
        <DialogTitle>
          {editItem ? "Edit Expense" : "Add New Expense"}
        </DialogTitle>
        <DialogContent dividers>
          <Box p={1}>
            <ExpenseForm
              expense={editItem}
              onSave={handleSaveExpense}
              onCancel={() => setExpenseDialogOpen(false)}
              budgetId={id}
              categories={budget?.categories || []}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Income Dialog */}
      <Dialog
        open={incomeDialogOpen}
        onClose={() => setIncomeDialogOpen(false)}
        fullWidth
        maxWidth="md"
        disableRestoreFocus
      >
        <DialogTitle>{editItem ? "Edit Income" : "Add New Income"}</DialogTitle>
        <DialogContent dividers>
          <Box p={1}>
            <IncomeForm
              income={editItem}
              onSave={handleSaveIncome}
              onCancel={() => setIncomeDialogOpen(false)}
              budgetId={id}
              categories={budget?.categories || []}
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Edit Budget Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="md"
        disableRestoreFocus
      >
        <DialogTitle>Edit Budget</DialogTitle>
        <DialogContent dividers>
          <Box p={1}>
            <BudgetForm
              budget={budget}
              onSave={handleSaveBudget}
              onCancel={() => setEditDialogOpen(false)}
              mode="edit"
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default BudgetDetailPage;
