import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  LinearProgress,
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { deleteExpense } from "../api/budgetApi";

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Payment status chip color
const getPaymentStatusColor = (status) => {
  switch (status) {
    case "PAID":
      return "success";
    case "PENDING":
      return "warning";
    case "CANCELLED":
      return "error";
    default:
      return "default";
  }
};

const ExpenseList = ({
  expenses = [],
  onRefresh,
  onEdit,
  onAdd,
  loading = false,
  budgetId,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [orderBy, setOrderBy] = useState("date");
  const [order, setOrder] = useState("desc");

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (expense) => {
    setExpenseToDelete(expense);
    setDeleteDialogOpen(true);
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setExpenseToDelete(null);
  };

  // Execute expense deletion
  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return;

    try {
      await deleteExpense(expenseToDelete.id);
      handleCloseDeleteDialog();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error deleting expense:", error);
      // Error handling would go here
    }
  };

  // Handle sorting
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Create sort handler
  const createSortHandler = (property) => () => {
    handleRequestSort(property);
  };

  // Sort function
  const sortExpenses = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  // Comparator function
  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  // Descending comparator
  const descendingComparator = (a, b, orderBy) => {
    if (orderBy === "amount") {
      return parseFloat(b.amount) - parseFloat(a.amount);
    }

    if (orderBy === "date") {
      return new Date(b.date) - new Date(a.date);
    }

    if (!b[orderBy]) {
      return -1;
    }
    if (!a[orderBy]) {
      return 1;
    }
    return b[orderBy].localeCompare(a[orderBy]);
  };

  // Sort and slice the data for pagination
  const sortedExpenses = sortExpenses(expenses, getComparator(order, orderBy));
  const paginatedExpenses = sortedExpenses.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle edit expense
  const handleEditExpense = (expense) => {
    if (onEdit) onEdit(expense);
  };

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{ width: "100%", overflow: "hidden" }}
    >
      {loading && <LinearProgress />}

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="expense table">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "category"}
                  direction={orderBy === "category" ? order : "asc"}
                  onClick={createSortHandler("category")}
                >
                  Category
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "description"}
                  direction={orderBy === "description" ? order : "asc"}
                  onClick={createSortHandler("description")}
                >
                  Description
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "amount"}
                  direction={orderBy === "amount" ? order : "asc"}
                  onClick={createSortHandler("amount")}
                >
                  Amount
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "date"}
                  direction={orderBy === "date" ? order : "asc"}
                  onClick={createSortHandler("date")}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "vendor"}
                  direction={orderBy === "vendor" ? order : "asc"}
                  onClick={createSortHandler("vendor")}
                >
                  Vendor
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "paymentStatus"}
                  direction={orderBy === "paymentStatus" ? order : "asc"}
                  onClick={createSortHandler("paymentStatus")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedExpenses.length > 0 ? (
              paginatedExpenses.map((expense) => (
                <TableRow hover key={expense.id}>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>{formatDate(expense.date)}</TableCell>
                  <TableCell>{expense.vendor}</TableCell>
                  <TableCell>
                    <Chip
                      label={expense.paymentStatus}
                      size="small"
                      color={getPaymentStatusColor(expense.paymentStatus)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      {expense.receiptUrl && (
                        <Tooltip title="View Receipt">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              window.open(expense.receiptUrl, "_blank")
                            }
                          >
                            <ReceiptIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Edit Expense">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditExpense(expense)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Expense">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(expense)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="text.secondary">
                    No expenses found
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<ReceiptIcon />}
                    sx={{ mt: 1 }}
                    onClick={onAdd}
                  >
                    Add your first expense
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={expenses.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this expense?
            {expenseToDelete && (
              <Typography component="div" variant="body2" sx={{ mt: 1 }}>
                <strong>Description:</strong> {expenseToDelete.description}{" "}
                <br />
                <strong>Category:</strong> {expenseToDelete.category} <br />
                <strong>Amount:</strong>{" "}
                {formatCurrency(expenseToDelete.amount)} <br />
              </Typography>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteExpense}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ExpenseList;
