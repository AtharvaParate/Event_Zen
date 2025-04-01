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
  timeout: 60000, // Increase timeout to 60 seconds
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
    console.log(`Request to ${config.url}`, config);
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error logging
budgetAxios.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    if (error.response) {
      console.error(
        "Error response:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error("No response received:", error.request);
    }
    return Promise.reject(error);
  }
);

// Get all budgets with optional pagination
let budgetsCache = {
  data: null,
  timestamp: 0,
  page: -1,
  size: 0,
};

// Cache TTL in milliseconds (30 seconds)
const CACHE_TTL = 30000;

export const fetchBudgets = async (
  page = 0,
  size = API_CONFIG.DEFAULT_PAGE_SIZE,
  forceRefresh = false
) => {
  try {
    // Check if we have a valid cache for this page and size
    const now = Date.now();
    if (
      !forceRefresh &&
      budgetsCache.data &&
      budgetsCache.page === page &&
      budgetsCache.size === size &&
      now - budgetsCache.timestamp < CACHE_TTL
    ) {
      return budgetsCache.data;
    }

    // Only log when actually making a request, not on every call
    console.log(`Fetching budgets: page=${page}, size=${size}`);

    // Add cache buster to avoid browser caching
    const cacheBuster = `_cb=${now}`;

    // Use a more efficient request approach
    const response = await budgetAxios.get(
      `${BUDGET_ENDPOINTS.BUDGETS}?page=${page}&size=${size}&${cacheBuster}`,
      {
        timeout: 10000, // Shorter timeout for listing
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      }
    );

    // Process response
    let result;
    if (Array.isArray(response.data)) {
      // Convert array to paginated format
      result = {
        content: response.data,
        totalPages: 1,
        totalElements: response.data.length,
        size: size,
        number: page,
        first: page === 0,
        last: true,
      };
    } else {
      result = response.data;
    }

    // Update cache
    budgetsCache = {
      data: result,
      timestamp: now,
      page: page,
      size: size,
    };

    return result;
  } catch (error) {
    console.error("Error fetching budgets:", error.message);
    if (error.response) {
      console.error(`Response status: ${error.response.status}`);
    }
    throw error;
  }
};

// Add a function to clear the cache when needed (e.g., after create/update/delete)
export const clearBudgetsCache = () => {
  console.log("Clearing budgets cache");
  budgetsCache = {
    data: null,
    timestamp: 0,
    page: -1,
    size: 0,
  };
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
  let retries = 0;
  const maxRetries = 3;

  const tryCreate = async () => {
    try {
      console.log(
        `Attempt ${retries + 1}: Creating budget with data:`,
        budgetData
      );
      const response = await budgetAxios.post(
        BUDGET_ENDPOINTS.BUDGETS,
        budgetData,
        { timeout: 30000 } // 30 second timeout for each attempt
      );
      console.log("Budget created successfully:", response.data);

      // Clear the cache since we've added a new budget
      clearBudgetsCache();

      return response.data;
    } catch (error) {
      console.error(`Attempt ${retries + 1}: Error creating budget:`, error);

      // Check if it's a timeout or network error
      if (
        (error.code === "ECONNABORTED" ||
          (error.message && error.message.includes("timeout")) ||
          (error.message && error.message.includes("Network Error"))) &&
        retries < maxRetries
      ) {
        retries++;
        console.log(`Retrying create operation (${retries}/${maxRetries})...`);
        // Wait for 2 seconds before retrying
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return await tryCreate(); // Recursive retry
      }

      throw error;
    }
  };

  return tryCreate();
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

    // Clear the cache since we've updated a budget
    clearBudgetsCache();

    return response.data;
  } catch (error) {
    console.error(`Error updating budget with ID ${id}:`, error);
    throw error;
  }
};

// Delete budget with retry mechanism
export const deleteBudgetWithRetry = async (id, maxRetries = 3) => {
  let retries = 0;

  const tryDelete = async () => {
    try {
      console.log(`Attempt ${retries + 1}: Deleting budget with ID: ${id}`);
      // Use a different approach for the delete request
      const response = await axios({
        method: "delete",
        url: `${API_CONFIG.BUDGET_API_URL}${BUDGET_ENDPOINTS.BUDGET_BY_ID(id)}`,
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });

      console.log(
        `Budget ${id} deleted successfully:`,
        response.status,
        response.data
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error(
        `Attempt ${retries + 1}: Error deleting budget with ID ${id}:`,
        error
      );

      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;
        console.error(
          `Server responded with status: ${status}`,
          error.response.data
        );

        // If the budget doesn't exist, consider it successfully deleted
        if (status === 404) {
          console.log("Budget not found - already deleted or never existed");
          return { success: true, notFound: true };
        }

        // Handle authentication errors specifically
        if (status === 401 || status === 403) {
          console.error("Authentication error when trying to delete budget");
          throw error; // Don't retry auth errors
        }

        // Handle other server errors
        if (status >= 500) {
          if (retries < maxRetries) {
            retries++;
            console.log(
              `Retrying delete operation (${retries}/${maxRetries}) due to server error...`
            );
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return await tryDelete();
          }
        }
      }

      // Check if it's a timeout or network error
      if (
        (error.code === "ECONNABORTED" ||
          (error.message &&
            (error.message.includes("timeout") ||
              error.message.includes("Network Error")))) &&
        retries < maxRetries
      ) {
        retries++;
        console.log(`Retrying delete operation (${retries}/${maxRetries})...`);
        // Wait for 2 seconds before retrying
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return await tryDelete(); // Recursive retry
      }

      throw error;
    }
  };

  return tryDelete();
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

// Enhanced createBudget with retry
export const createBudgetWithRetry = async (budgetData, maxRetries = 2) => {
  let retries = 0;

  const tryCreate = async () => {
    try {
      console.log(
        `Attempt ${retries + 1}: Creating budget with data:`,
        budgetData
      );
      const response = await budgetAxios.post(
        BUDGET_ENDPOINTS.BUDGETS,
        budgetData,
        { timeout: 20000 } // Shorter timeout for each attempt
      );
      console.log("Budget created successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Attempt ${retries + 1}: Error creating budget:`, error);

      // Check if it's a timeout or network error
      if (
        error.message &&
        (error.message.includes("timeout") ||
          error.message.includes("Network Error")) &&
        retries < maxRetries
      ) {
        retries++;
        console.log(`Retrying create operation (${retries}/${maxRetries})...`);
        return await tryCreate(); // Recursive retry
      }

      throw error;
    }
  };

  return tryCreate();
};

// Enhanced updateBudget with retry
export const updateBudgetWithRetry = async (id, budgetData, maxRetries = 2) => {
  let retries = 0;

  const tryUpdate = async () => {
    try {
      console.log(
        `Attempt ${retries + 1}: Updating budget ${id} with data:`,
        budgetData
      );
      const response = await budgetAxios.put(
        BUDGET_ENDPOINTS.BUDGET_BY_ID(id),
        budgetData,
        { timeout: 20000 } // Shorter timeout for each attempt
      );
      console.log(`Budget ${id} updated successfully:`, response.data);
      return response.data;
    } catch (error) {
      console.error(
        `Attempt ${retries + 1}: Error updating budget with ID ${id}:`,
        error
      );

      // Check if it's a timeout or network error
      if (
        error.message &&
        (error.message.includes("timeout") ||
          error.message.includes("Network Error")) &&
        retries < maxRetries
      ) {
        retries++;
        console.log(`Retrying update operation (${retries}/${maxRetries})...`);
        return await tryUpdate(); // Recursive retry
      }

      throw error;
    }
  };

  return tryUpdate();
};

// Delete budget
export const deleteBudget = async (id) => {
  console.log(`Initiating deletion of budget with ID: ${id}`);
  try {
    if (!id) {
      console.error("Cannot delete budget: id is undefined or null");
      throw new Error("Budget ID is required for deletion");
    }

    // Validate ID format
    const budgetId = parseInt(id, 10);
    if (isNaN(budgetId)) {
      console.error(`Invalid budget ID format: ${id}`);
      throw new Error("Invalid budget ID format");
    }

    // Use the enhanced version with retry
    const result = await deleteBudgetWithRetry(budgetId, 3);

    if (result && (result.success || result.notFound)) {
      console.log(`Budget ${id} deletion completed successfully`, result);

      // Clear the cache since we've deleted a budget
      clearBudgetsCache();

      return {
        success: true,
        message: "Budget deleted successfully",
        data: result.data || null,
      };
    } else {
      throw new Error("Unknown error occurred during budget deletion");
    }
  } catch (error) {
    console.error(`Final error deleting budget ${id}:`, error);
    // If we've reached here, all retries have failed
    throw error;
  }
};
