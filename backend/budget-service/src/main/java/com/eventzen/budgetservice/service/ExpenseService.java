package com.eventzen.budgetservice.service;

import com.eventzen.budgetservice.dto.ExpenseDTO;
import com.eventzen.budgetservice.model.Expense;

import java.util.List;

public interface ExpenseService {
    
    List<ExpenseDTO> getAllExpenses();
    
    ExpenseDTO getExpenseById(Long id);
    
    List<ExpenseDTO> getExpensesByBudgetId(Long budgetId);
    
    ExpenseDTO createExpense(ExpenseDTO expenseDTO);
    
    ExpenseDTO updateExpense(Long id, ExpenseDTO expenseDTO);
    
    void deleteExpense(Long id);
    
    List<ExpenseDTO> getExpensesByPaymentStatus(Expense.PaymentStatus paymentStatus);
    
} 