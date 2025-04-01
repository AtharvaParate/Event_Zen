import React, { useMemo } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material";

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

const BudgetSummary = ({ budget, expenses = [], incomes = [] }) => {
  // Calculate total expenses by category
  const expensesByCategory = useMemo(() => {
    const categoryMap = {};
    expenses.forEach((expense) => {
      const category = expense.category || "Uncategorized";
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category] += parseFloat(expense.amount);
    });
    return Object.entries(categoryMap)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  // Calculate total income by category
  const incomesByCategory = useMemo(() => {
    const categoryMap = {};
    incomes.forEach((income) => {
      const category = income.category || "Uncategorized";
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category] += parseFloat(income.amount);
    });
    return Object.entries(categoryMap)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [incomes]);

  // Calculate total expense
  const totalExpense = useMemo(() => {
    return expenses.reduce(
      (sum, expense) => sum + parseFloat(expense.amount),
      0
    );
  }, [expenses]);

  // Calculate total income
  const totalIncome = useMemo(() => {
    return incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
  }, [incomes]);

  // Calculate net balance
  const netBalance = totalIncome - totalExpense;

  // Calculate budget utilization percentage
  const budgetUtilization = useMemo(() => {
    if (!budget || budget.totalBudget <= 0) return 0;
    return (totalExpense / budget.totalBudget) * 100;
  }, [budget, totalExpense]);

  // Determine if budget is overspent
  const isOverBudget = budget && totalExpense > budget.totalBudget;

  // Get top expense categories (top 5)
  const topExpenseCategories = expensesByCategory.slice(0, 5);

  // Get top income categories (top 5)
  const topIncomeCategories = incomesByCategory.slice(0, 5);

  // Calculate expense by month
  const expensesByMonth = useMemo(() => {
    const monthMap = {};
    expenses.forEach((expense) => {
      if (!expense.date) return;
      const date = new Date(expense.date);
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`;
      if (!monthMap[monthYear]) {
        monthMap[monthYear] = 0;
      }
      monthMap[monthYear] += parseFloat(expense.amount);
    });
    return monthMap;
  }, [expenses]);

  // Calculate most recent transactions
  const recentTransactions = useMemo(() => {
    const allTransactions = [
      ...expenses.map((e) => ({ ...e, type: "expense" })),
      ...incomes.map((i) => ({ ...i, type: "income" })),
    ];

    return allTransactions
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [expenses, incomes]);

  // Render bar for visualizing category distribution
  const renderCategoryBar = (amount, total) => {
    const percentage = total > 0 ? (amount / total) * 100 : 0;
    return (
      <Box sx={{ display: "flex", alignItems: "center", mt: 0.5, mb: 1 }}>
        <Box
          sx={{
            width: `${percentage}%`,
            height: 8,
            bgcolor: "primary.main",
            borderRadius: 1,
            mr: 1,
            minWidth: 4,
          }}
        />
        <Typography variant="body2" color="text.secondary">
          {percentage.toFixed(1)}%
        </Typography>
      </Box>
    );
  };

  return (
    <Grid container spacing={3}>
      {/* Summary Cards */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Total Expenses
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TrendingDownIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="h4" component="div">
                {formatCurrency(totalExpense)}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {expenses.length} expense transactions
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Total Income
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <TrendingUpIcon color="success" sx={{ mr: 1 }} />
              <Typography variant="h4" component="div">
                {formatCurrency(totalIncome)}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {incomes.length} income transactions
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Net Balance
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AttachMoneyIcon
                color={netBalance >= 0 ? "success" : "error"}
                sx={{ mr: 1 }}
              />
              <Typography
                variant="h4"
                component="div"
                color={netBalance >= 0 ? "success.main" : "error.main"}
              >
                {formatCurrency(netBalance)}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              color={netBalance >= 0 ? "success.main" : "error.main"}
              sx={{ mt: 1 }}
            >
              {netBalance >= 0
                ? "You have a positive balance"
                : "Your expenses exceed your income"}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Budget Status */}
      <Grid item xs={12}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Budget Status
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="body2">Budget Progress:</Typography>
                <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
                  <Box sx={{ flexGrow: 1, mr: 1 }}>
                    <Box
                      sx={{
                        height: 10,
                        width: "100%",
                        bgcolor: "grey.200",
                        borderRadius: 5,
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          height: "100%",
                          width: `${Math.min(100, budgetUtilization)}%`,
                          bgcolor:
                            budgetUtilization > 90
                              ? "error.main"
                              : budgetUtilization > 75
                              ? "warning.main"
                              : "primary.main",
                          borderRadius: 5,
                          transition: "width 0.5s ease-in-out",
                        }}
                      />
                    </Box>
                  </Box>
                  <Typography
                    variant="body2"
                    color={
                      budgetUtilization > 90 ? "error.main" : "text.secondary"
                    }
                  >
                    {budgetUtilization.toFixed(1)}%
                  </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Budget:</Typography>
                    <Typography variant="h6">
                      {formatCurrency(budget?.totalBudget || 0)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Remaining:</Typography>
                    <Typography
                      variant="h6"
                      color={isOverBudget ? "error.main" : "success.main"}
                    >
                      {formatCurrency(
                        (budget?.totalBudget || 0) - totalExpense
                      )}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              {isOverBudget ? (
                <Box
                  sx={{ height: "100%", display: "flex", alignItems: "center" }}
                >
                  <WarningIcon />
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ ml: 1 }}
                  >
                    Budget Exceeded
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    You have exceeded your budget by{" "}
                    {formatCurrency(totalExpense - (budget?.totalBudget || 0))}.
                    Consider revising your budget or reducing expenses.
                  </Typography>
                </Box>
              ) : budgetUtilization > 90 ? (
                <Box
                  sx={{ height: "100%", display: "flex", alignItems: "center" }}
                >
                  <WarningIcon />
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ ml: 1 }}
                  >
                    Budget Almost Depleted
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    You have used {budgetUtilization.toFixed(1)}% of your
                    budget. Only{" "}
                    {formatCurrency((budget?.totalBudget || 0) - totalExpense)}{" "}
                    remaining.
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{ height: "100%", display: "flex", alignItems: "center" }}
                >
                  <CheckCircleIcon color="success" />
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ ml: 1 }}
                  >
                    Budget on Track
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 2 }}>
                    Your budget is on track with{" "}
                    {formatCurrency((budget?.totalBudget || 0) - totalExpense)}{" "}
                    remaining.
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Box>
      </Grid>

      {/* Expense by Category */}
      <Grid item xs={12} md={6}>
        <Box sx={{ p: 2, height: "100%" }}>
          <Typography variant="h6" gutterBottom>
            Top Expense Categories
          </Typography>

          {topExpenseCategories.length > 0 ? (
            <Box>
              {topExpenseCategories.map((category, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body1">{category.category}</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {formatCurrency(category.amount)}
                    </Typography>
                  </Box>
                  {renderCategoryBar(category.amount, totalExpense)}
                </Box>
              ))}
            </Box>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 3 }}
            >
              No expense data available
            </Typography>
          )}
        </Box>
      </Grid>

      {/* Income by Category */}
      <Grid item xs={12} md={6}>
        <Box sx={{ p: 2, height: "100%" }}>
          <Typography variant="h6" gutterBottom>
            Top Income Categories
          </Typography>

          {topIncomeCategories.length > 0 ? (
            <Box>
              {topIncomeCategories.map((category, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="body1">{category.category}</Typography>
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      color="success.main"
                    >
                      {formatCurrency(category.amount)}
                    </Typography>
                  </Box>
                  {renderCategoryBar(category.amount, totalIncome)}
                </Box>
              ))}
            </Box>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 3 }}
            >
              No income data available
            </Typography>
          )}
        </Box>
      </Grid>

      {/* Recent Transactions */}
      <Grid item xs={12}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Recent Transactions
          </Typography>

          {recentTransactions.length > 0 ? (
            <Box>
              {recentTransactions.map((transaction, index) => (
                <Box key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      py: 1,
                    }}
                  >
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        {transaction.type === "expense" ? (
                          <TrendingDownIcon
                            color="error"
                            fontSize="small"
                            sx={{ mr: 1 }}
                          />
                        ) : (
                          <TrendingUpIcon
                            color="success"
                            fontSize="small"
                            sx={{ mr: 1 }}
                          />
                        )}
                        <Typography variant="body1">
                          {transaction.description}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {transaction.type === "expense"
                          ? transaction.category + " - " + transaction.vendor
                          : transaction.category + " - " + transaction.source}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color={
                          transaction.type === "expense"
                            ? "error.main"
                            : "success.main"
                        }
                      >
                        {transaction.type === "expense" ? "-" : "+"}
                        {formatCurrency(transaction.amount)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDate(transaction.date)}
                      </Typography>
                    </Box>
                  </Box>
                  {index < recentTransactions.length - 1 && <LinearProgress />}
                </Box>
              ))}
            </Box>
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textAlign: "center", py: 3 }}
            >
              No transactions available
            </Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default BudgetSummary;
