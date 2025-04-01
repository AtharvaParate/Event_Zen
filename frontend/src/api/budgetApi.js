import axios from "axios";
import {
  API_CONFIG,
  BUDGET_ENDPOINTS,
  getAuthHeader,
} from "../config/apiConfig";

// Base URL for budget API
const BUDGET_API_URL = "/api/budgets";
const EXPENSE_API_URL = "/api/expenses";
const INCOME_API_URL = "/api/incomes";

// Create a separate axios instance for budget services with proper base URL
const budgetAxios = axios.create({
  baseURL: API_CONFIG.BUDGET_API_URL,
  timeout: API_CONFIG.REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth interceptor
budgetAxios.interceptors.request.use(
  (config) => {
    const authHeaders = getAuthHeader();
    if (authHeaders.Authorization) {
      config.headers["Authorization"] = authHeaders.Authorization;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get all budgets with optional pagination
export const fetchBudgets = async (
  page = 0,
  size = API_CONFIG.DEFAULT_PAGE_SIZE
) => {
  try {
    console.log(
      `===== UPDATED fetchBudgets called: page=${page}, size=${size} =====`
    );
    console.log(`===== Budget API URL: ${API_CONFIG.BUDGET_API_URL} =====`);
    console.log(`===== Budget endpoint: ${BUDGET_ENDPOINTS.BUDGETS} =====`);
    console.log(`===== Using mock data: ${false} =====`);

    const response = await budgetAxios.get(
      `${BUDGET_ENDPOINTS.BUDGETS}?page=${page}&size=${size}`
    );
    console.log("===== Budgets fetched successfully =====");
    console.log(
      "===== Response data type:",
      typeof response.data,
      Array.isArray(response.data) ? "array" : "not array"
    );

    // Check if the response is an array (non-paginated) or an object with content (paginated)
    if (Array.isArray(response.data)) {
      console.log("===== Converting array response to paginated format =====");
      // Convert the array response to a paginated format
      return {
        content: response.data,
        totalPages: 1,
        totalElements: response.data.length,
        size: size,
        number: page,
        first: page === 0,
        last: true,
      };
    }

    return response.data;
  } catch (error) {
    console.error("===== Error fetching budgets =====", error);
    console.error(`===== Error details: ${error.message} =====`);
    console.error(
      `===== Is network error: ${error.isAxiosError && !error.response} =====`
    );

    if (error.response) {
      console.error(`===== Response status: ${error.response.status} =====`);
      console.error(
        `===== Response data: ${JSON.stringify(error.response.data)} =====`
      );
    }

    // No fallback to mock data - throw the error to be handled by the caller
    throw error;
  }
};

// Get budget by ID
export const fetchBudgetById = async (id) => {
  try {
    console.log(`Fetching budget with ID: ${id}`);
    const response = await budgetAxios.get(BUDGET_ENDPOINTS.BUDGET_BY_ID(id));
    console.log(`Budget ${id} fetched successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching budget with ID ${id}:`, error);
    throw error;
  }
};

// Get budget by event ID
export const fetchBudgetByEventId = async (eventId) => {
  try {
    console.log(`Fetching budget for event ID: ${eventId}`);
    const response = await budgetAxios.get(
      BUDGET_ENDPOINTS.BUDGET_BY_EVENT(eventId)
    );
    console.log(
      `Budget for event ${eventId} fetched successfully:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching budget for event ID ${eventId}:`, error);
    throw error;
  }
};

// Create new budget
export const createBudget = async (budgetData) => {
  try {
    console.log("Creating budget with data:", budgetData);
    const response = await budgetAxios.post(
      BUDGET_ENDPOINTS.BUDGETS,
      budgetData
    );
    console.log("Budget created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating budget:", error);
    throw error;
  }
};

// Update budget
export const updateBudget = async (id, budgetData) => {
  try {
    console.log(`Updating budget ${id} with data:`, budgetData);
    const response = await budgetAxios.put(
      BUDGET_ENDPOINTS.BUDGET_BY_ID(id),
      budgetData
    );
    console.log(`Budget ${id} updated successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating budget with ID ${id}:`, error);
    throw error;
  }
};

// Delete budget
export const deleteBudget = async (id) => {
  try {
    console.log(`Deleting budget with ID: ${id}`);
    await budgetAxios.delete(BUDGET_ENDPOINTS.BUDGET_BY_ID(id));
    console.log(`Budget ${id} deleted successfully`);
    return true;
  } catch (error) {
    console.error(`Error deleting budget with ID ${id}:`, error);

    // No fallback to mock data - throw the error
    throw error;
  }
};

// Expense-related functions

// Get expenses for a budget
export const fetchExpensesByBudgetId = async (
  budgetId,
  page = 0,
  size = 20
) => {
  try {
    console.log(`Fetching expenses for budget ID: ${budgetId}`);
    const response = await budgetAxios.get(
      BUDGET_ENDPOINTS.EXPENSES_BY_BUDGET(budgetId) +
        `?page=${page}&size=${size}`
    );
    console.log(
      `Expenses for budget ${budgetId} fetched successfully:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching expenses for budget ID ${budgetId}:`, error);
    throw error;
  }
};

// Create new expense
export const createExpense = async (expenseData) => {
  try {
    console.log("Creating expense with data:", expenseData);
    const response = await budgetAxios.post(
      BUDGET_ENDPOINTS.EXPENSES,
      expenseData
    );
    console.log("Expense created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
  }
};

// Update expense
export const updateExpense = async (id, expenseData) => {
  try {
    console.log(`Updating expense ${id} with data:`, expenseData);
    const response = await budgetAxios.put(
      BUDGET_ENDPOINTS.EXPENSE_BY_ID(id),
      expenseData
    );
    console.log(`Expense ${id} updated successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating expense with ID ${id}:`, error);
    throw error;
  }
};

// Delete expense
export const deleteExpense = async (id) => {
  try {
    console.log(`Deleting expense with ID: ${id}`);
    await budgetAxios.delete(BUDGET_ENDPOINTS.EXPENSE_BY_ID(id));
    console.log(`Expense ${id} deleted successfully`);
    return true;
  } catch (error) {
    console.error(`Error deleting expense with ID ${id}:`, error);
    throw error;
  }
};

// Income-related functions

// Get incomes for a budget
export const fetchIncomesByBudgetId = async (budgetId, page = 0, size = 20) => {
  try {
    console.log(`Fetching incomes for budget ID: ${budgetId}`);
    const response = await budgetAxios.get(
      BUDGET_ENDPOINTS.INCOMES_BY_BUDGET(budgetId) +
        `?page=${page}&size=${size}`
    );
    console.log(
      `Incomes for budget ${budgetId} fetched successfully:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching incomes for budget ID ${budgetId}:`, error);
    throw error;
  }
};

// Create new income
export const createIncome = async (incomeData) => {
  try {
    console.log("Creating income with data:", incomeData);
    const response = await budgetAxios.post(
      BUDGET_ENDPOINTS.INCOMES,
      incomeData
    );
    console.log("Income created successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating income:", error);
    throw error;
  }
};

// Update income
export const updateIncome = async (id, incomeData) => {
  try {
    console.log(`Updating income ${id} with data:`, incomeData);
    const response = await budgetAxios.put(
      BUDGET_ENDPOINTS.INCOME_BY_ID(id),
      incomeData
    );
    console.log(`Income ${id} updated successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating income with ID ${id}:`, error);
    throw error;
  }
};

// Delete income
export const deleteIncome = async (id) => {
  try {
    console.log(`Deleting income with ID: ${id}`);
    await budgetAxios.delete(BUDGET_ENDPOINTS.INCOME_BY_ID(id));
    console.log(`Income ${id} deleted successfully`);
    return true;
  } catch (error) {
    console.error(`Error deleting income with ID ${id}:`, error);
    throw error;
  }
};
