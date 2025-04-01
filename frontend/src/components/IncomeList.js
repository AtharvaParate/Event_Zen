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
  AttachMoney as MoneyIcon,
} from "@mui/icons-material";
import { deleteIncome } from "../api/budgetApi";

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

// Status chip color
const getStatusColor = (status) => {
  switch (status) {
    case "RECEIVED":
      return "success";
    case "PENDING":
      return "warning";
    case "CANCELLED":
      return "error";
    default:
      return "default";
  }
};

const IncomeList = ({
  incomes = [],
  onRefresh,
  onEdit,
  onAdd,
  loading = false,
  budgetId,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [incomeToDelete, setIncomeToDelete] = useState(null);
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
  const handleDeleteClick = (income) => {
    setIncomeToDelete(income);
    setDeleteDialogOpen(true);
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setIncomeToDelete(null);
  };

  // Execute income deletion
  const handleDeleteIncome = async () => {
    if (!incomeToDelete) return;

    try {
      await deleteIncome(incomeToDelete.id);
      handleCloseDeleteDialog();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error deleting income:", error);
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
  const sortIncomes = (array, comparator) => {
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
  const sortedIncomes = sortIncomes(incomes, getComparator(order, orderBy));
  const paginatedIncomes = sortedIncomes.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle edit income
  const handleEditIncome = (income) => {
    if (onEdit) onEdit(income);
  };

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{ width: "100%", overflow: "hidden" }}
    >
      {loading && <LinearProgress />}

      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="income table">
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
                  active={orderBy === "source"}
                  direction={orderBy === "source" ? order : "asc"}
                  onClick={createSortHandler("source")}
                >
                  Source
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={createSortHandler("status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedIncomes.length > 0 ? (
              paginatedIncomes.map((income) => (
                <TableRow hover key={income.id}>
                  <TableCell>{income.category}</TableCell>
                  <TableCell>{income.description}</TableCell>
                  <TableCell>{formatCurrency(income.amount)}</TableCell>
                  <TableCell>{formatDate(income.date)}</TableCell>
                  <TableCell>{income.source}</TableCell>
                  <TableCell>
                    <Chip
                      label={income.status}
                      size="small"
                      color={getStatusColor(income.status)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Tooltip title="Edit Income">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditIncome(income)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Income">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(income)}
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
                    No income entries found
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<MoneyIcon />}
                    sx={{ mt: 1 }}
                    onClick={onAdd}
                  >
                    Add your first income entry
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
        count={incomes.length}
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
            Are you sure you want to delete this income entry?
            {incomeToDelete && (
              <Typography component="div" variant="body2" sx={{ mt: 1 }}>
                <strong>Description:</strong> {incomeToDelete.description}{" "}
                <br />
                <strong>Category:</strong> {incomeToDelete.category} <br />
                <strong>Amount:</strong> {formatCurrency(incomeToDelete.amount)}{" "}
                <br />
              </Typography>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteIncome}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default IncomeList;
